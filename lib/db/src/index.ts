import {
  ref,
  push,
  get,
  set,
  update,
  remove,
  type DatabaseReference,
} from "firebase/database";
import { getDb } from "./firebase";
import type { Contact, ContactStatus } from "./schema/contacts";
import type { Testimonial } from "./schema/testimonials";
import type { Comment, CommentStatus } from "./schema/comments";
import type { SiteContent } from "./schema/site-content";

export * from "./schema";
export { getDb, getFirebaseApp } from "./firebase";

const CONTACTS_PATH = "contacts";
const TESTIMONIALS_PATH = "testimonials";
const COMMENTS_PATH = "comments";
const SITE_CONTENT_PATH = "site_content";
const ADMIN_USERS_PATH = "admin_users";

function rowsToList<T extends { createdAt?: string; id: string }>(
  snapshotVal: Record<string, Omit<T, "id">> | null,
): T[] {
  if (!snapshotVal) return [];
  return Object.entries(snapshotVal)
    .map(([key, value]) => ({ ...(value as Omit<T, "id">), id: key }) as T)
    .sort((a, b) => {
      const dateA = a.createdAt || "";
      const dateB = b.createdAt || "";
      return dateB.localeCompare(dateA);
    });
}

function contactsRef(): DatabaseReference {
  return ref(getDb(), CONTACTS_PATH);
}
function testimonialsRef(): DatabaseReference {
  return ref(getDb(), TESTIMONIALS_PATH);
}
function commentsRef(): DatabaseReference {
  return ref(getDb(), COMMENTS_PATH);
}
function siteContentRef(section: string): DatabaseReference {
  return ref(getDb(), `${SITE_CONTENT_PATH}/${section}`);
}

export const contactsRepo = {
  async create(input: {
    name: string;
    email: string;
    phone?: string | null;
    company?: string | null;
    service?: string | null;
    message: string;
    status?: ContactStatus;
  }): Promise<Contact> {
    const createdAt = new Date().toISOString();
    const record: Omit<Contact, "id"> = {
      name: input.name,
      email: input.email,
      phone: input.phone ?? null,
      company: input.company ?? null,
      service: input.service ?? null,
      message: input.message,
      status: input.status ?? "new",
      createdAt,
    };
    const newRef = push(contactsRef());
    await set(newRef, record);
    return { ...record, id: newRef.key! };
  },

  async list(opts: {
    page: number;
    limit: number;
    status?: string;
  }): Promise<{ items: Contact[]; total: number }> {
    const snap = await get(contactsRef());
    const all = rowsToList<Contact>(snap.val());
    const filtered = opts.status
      ? all.filter((c) => c.status === opts.status)
      : all;
    const offset = (opts.page - 1) * opts.limit;
    const items = filtered.slice(offset, offset + opts.limit);
    return { items, total: filtered.length };
  },

  async getById(id: string): Promise<Contact | null> {
    const snap = await get(ref(getDb(), `${CONTACTS_PATH}/${id}`));
    if (!snap.exists()) return null;
    return { ...(snap.val() as Omit<Contact, "id">), id };
  },

  async update(
    id: string,
    patch: Partial<Pick<Contact, "status">>,
  ): Promise<Contact | null> {
    const itemRef = ref(getDb(), `${CONTACTS_PATH}/${id}`);
    const existing = await get(itemRef);
    if (!existing.exists()) return null;
    const cleaned = Object.fromEntries(
      Object.entries(patch).filter(([, v]) => v !== undefined),
    );
    if (Object.keys(cleaned).length > 0) {
      await update(itemRef, cleaned);
    }
    const updated = await get(itemRef);
    return { ...(updated.val() as Omit<Contact, "id">), id };
  },

  async delete(id: string): Promise<void> {
    await remove(ref(getDb(), `${CONTACTS_PATH}/${id}`));
  },

  async countByStatus(status?: string): Promise<number> {
    const snap = await get(contactsRef());
    const all = rowsToList<Contact>(snap.val());
    if (!status) return all.length;
    return all.filter((c) => c.status === status).length;
  },

  async recent(limit: number): Promise<Contact[]> {
    const snap = await get(contactsRef());
    const all = rowsToList<Contact>(snap.val());
    return all.slice(0, limit);
  },
};

export const testimonialsRepo = {
  async list(): Promise<Testimonial[]> {
    const snap = await get(testimonialsRef());
    return rowsToList<Testimonial>(snap.val());
  },

  async create(input: {
    clientName: string;
    company?: string | null;
    content: string;
    rating: number;
    facebookUrl?: string | null;
  }): Promise<Testimonial> {
    const createdAt = new Date().toISOString();
    const record: Omit<Testimonial, "id"> = {
      clientName: input.clientName,
      company: input.company ?? null,
      content: input.content,
      rating: input.rating,
      facebookUrl: input.facebookUrl ?? null,
      createdAt,
    };
    const newRef = push(testimonialsRef());
    await set(newRef, record);
    return { ...record, id: newRef.key! };
  },

  async delete(id: string): Promise<void> {
    await remove(ref(getDb(), `${TESTIMONIALS_PATH}/${id}`));
  },

  async count(): Promise<number> {
    const snap = await get(testimonialsRef());
    if (!snap.exists()) return 0;
    return Object.keys(snap.val() as Record<string, unknown>).length;
  },
};

export interface AdminUser {
  username: string;
  password: string;
  createdAt: string;
}

function adminUserRef(username: string): DatabaseReference {
  return ref(getDb(), `${ADMIN_USERS_PATH}/${username}`);
}

function adminUsersRef(): DatabaseReference {
  return ref(getDb(), ADMIN_USERS_PATH);
}

export const adminUsersRepo = {
  async get(username: string): Promise<AdminUser | null> {
    const snap = await get(adminUserRef(username));
    if (!snap.exists()) return null;
    return snap.val() as AdminUser;
  },

  async upsert(username: string, password: string): Promise<AdminUser> {
    const record: AdminUser = {
      username,
      password,
      createdAt: new Date().toISOString(),
    };
    await set(adminUserRef(username), record);
    return record;
  },

  async hasAny(): Promise<boolean> {
    const snap = await get(adminUsersRef());
    return snap.exists();
  },

  async verify(username: string, password: string): Promise<boolean> {
    const user = await this.get(username);
    if (!user) return false;
    return user.password === password;
  },
};

export const siteContentRepo = {
  async get(section: string): Promise<SiteContent | null> {
    const snap = await get(siteContentRef(section));
    if (!snap.exists()) return null;
    return snap.val() as SiteContent;
  },

  async upsert(section: string, content: unknown): Promise<SiteContent> {
    const record: SiteContent = {
      section,
      content,
      updatedAt: new Date().toISOString(),
    };
    await set(siteContentRef(section), record);
    return record;
  },
};

export const commentsRepo = {
  async list(opts?: {
    page?: number;
    limit?: number;
    status?: CommentStatus;
  }): Promise<{ items: Comment[]; total: number }> {
    const snap = await get(commentsRef());
    const all = rowsToList<Comment>(snap.val());
    const filtered = opts?.status
      ? all.filter((c) => c.status === opts.status)
      : all;
    
    if (!opts?.page || !opts?.limit) {
      return { items: filtered, total: filtered.length };
    }
    
    const offset = (opts.page - 1) * opts.limit;
    const items = filtered.slice(offset, offset + opts.limit);
    return { items, total: filtered.length };
  },

  async create(input: {
    name: string;
    email: string;
    content: string;
    status?: CommentStatus;
  }): Promise<Comment> {
    const createdAt = new Date().toISOString();
    const record: Omit<Comment, "id"> = {
      name: input.name,
      email: input.email,
      content: input.content,
      status: input.status ?? "pending",
      createdAt,
    };
    const newRef = push(commentsRef());
    await set(newRef, record);
    return { ...record, id: newRef.key! };
  },

  async getById(id: string): Promise<Comment | null> {
    const snap = await get(ref(getDb(), `${COMMENTS_PATH}/${id}`));
    if (!snap.exists()) return null;
    return { ...(snap.val() as Omit<Comment, "id">), id };
  },

  async update(
    id: string,
    patch: Partial<Pick<Comment, "status">>,
  ): Promise<Comment | null> {
    const itemRef = ref(getDb(), `${COMMENTS_PATH}/${id}`);
    const existing = await get(itemRef);
    if (!existing.exists()) return null;
    const cleaned = Object.fromEntries(
      Object.entries(patch).filter(([, v]) => v !== undefined),
    );
    if (Object.keys(cleaned).length > 0) {
      await update(itemRef, cleaned);
    }
    const updated = await get(itemRef);
    return { ...(updated.val() as Omit<Comment, "id">), id };
  },

  async delete(id: string): Promise<void> {
    await remove(ref(getDb(), `${COMMENTS_PATH}/${id}`));
  },

  async countByStatus(status?: CommentStatus): Promise<number> {
    const snap = await get(commentsRef());
    const all = rowsToList<Comment>(snap.val());
    if (!status) return all.length;
    return all.filter((c) => c.status === status).length;
  },

  async recent(limit: number): Promise<Comment[]> {
    const snap = await get(commentsRef());
    const all = rowsToList<Comment>(snap.val());
    return all.slice(0, limit);
  },
};

