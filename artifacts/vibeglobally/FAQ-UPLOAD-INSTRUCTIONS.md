# FAQ Upload Instructions

## Method 1: Using the Admin Panel (Easiest)

1. **Login to Admin**
   - Go to: https://vibeglobally-79ca7.web.app/admin/login
   - Enter your admin credentials

2. **Navigate to FAQ Editor**
   - Go to: https://vibeglobally-79ca7.web.app/admin/edit-faq
   - Or click "FAQ Editor" from the admin dashboard

3. **Add/Edit FAQ Items**
   - Use the interface to add questions and answers
   - Save your changes
   - The FAQ will update immediately on the live site

---

## Method 2: Using the Seed Script

If you want to bulk upload all FAQ items at once:

### Prerequisites
- Your API server must be running
- You need to know your API URL

### Steps

1. **Set your API URL** (if different from localhost:8080)
   ```bash
   export API_URL=https://your-api-url.com
   ```

2. **Run the seed script**
   ```bash
   cd artifacts/vibeglobally
   node scripts/seed-faq.mjs
   ```

3. **Verify**
   - Check your website to see if the FAQ appears
   - Or check the admin panel at `/admin/edit-faq`

---

## Method 3: Direct API Call

You can also use curl or Postman to upload the FAQ data:

```bash
curl -X PUT https://your-api-url.com/api/site-content/faq \
  -H "Content-Type: application/json" \
  -d '{
    "section": "faq",
    "content": {
      "sectionTitle": "Frequently Asked Questions",
      "sectionDescription": "Get answers to common questions about our virtual staffing and outsourcing services",
      "items": [
        {
          "question": "What is Vibeglobally?",
          "answer": "Vibeglobally is a virtual staffing and outsourcing company..."
        }
        // ... add all FAQ items here
      ]
    }
  }'
```

---

## FAQ Data Structure

The FAQ data should follow this structure:

```json
{
  "sectionTitle": "Frequently Asked Questions",
  "sectionDescription": "Description text",
  "items": [
    {
      "question": "Question text?",
      "answer": "Answer text."
    }
  ]
}
```

---

## Current FAQ Items

The following 13 FAQ items are ready to be uploaded:

1. What is Vibeglobally?
2. What services do you offer?
3. Who can benefit from Vibeglobally's services?
4. Where are your virtual staff based?
5. Are your virtual assistants trained?
6. Can I hire for multiple roles at once?
7. Do you provide full-time or part-time staff?
8. How do you ensure quality of work?
9. Can your team work in my systems and tools?
10. How fast can I get started?
11. How is pricing structured?
12. Why choose Vibeglobally over hiring directly?
13. **Can I work with the freelancer directly and pay them directly?** (includes legal reference and buyout option)

---

## Troubleshooting

### FAQ not showing on website
- Check if the API is returning data (inspect network tab in browser)
- Verify the database has the FAQ content
- Clear browser cache and reload

### Seed script fails
- Make sure API server is running
- Check the API_URL is correct
- Verify the API endpoint accepts PUT requests

### Admin panel not accessible
- Make sure you're logged in as admin
- Check if the route `/admin/edit-faq` exists
- Verify your admin credentials

---

## Need Help?

If you encounter issues:
1. Check the browser console for errors
2. Check the API server logs
3. Verify your database connection
4. Make sure the site-content table exists in your database
