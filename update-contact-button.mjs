import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, set } from 'firebase/database';

// Firebase configuration - using your project ID
const firebaseConfig = {
  databaseURL: "https://vibeglobally-79ca7-default-rtdb.firebaseio.com/",
  projectId: "vibeglobally-79ca7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

async function updateContactButton() {
  try {
    console.log('Fetching current contact section data...');
    
    // Get current contact section data
    const contactRef = ref(db, 'site_content/contact');
    const snapshot = await get(contactRef);
    
    if (snapshot.exists()) {
      const data = snapshot.val();
      console.log('Current data:', JSON.stringify(data, null, 2));
      
      // Update the submitButtonText
      if (data.content) {
        data.content.submitButtonText = "Contact Us";
        data.updatedAt = new Date().toISOString();
        
        console.log('\nUpdating submitButtonText to "Contact Us"...');
        await set(contactRef, data);
        console.log('✅ Successfully updated button text to "Contact Us"!');
      } else {
        console.log('⚠️  No content field found in the data');
      }
    } else {
      console.log('⚠️  No contact section data found in database');
      console.log('Creating new contact section with default values...');
      
      const newData = {
        section: "contact",
        content: {
          headline: "Ready to Scale?",
          subheadline: "Tell us about your operational needs. We'll build a custom plan and contact us to get started.",
          steps: [
            { title: "Discovery Call", description: "We analyze your workflows and identify the exact profiles you need." },
            { title: "Team Selection", description: "We vet, train, and present candidates that fit your VIBE." },
            { title: "Deployment", description: "Seamless integration into your tech stack. Immediate results." }
          ],
          email: "vibegloballyteam@gmail.com",
          phone: "+63 917 279 8754",
          address: "General Trias, Cavite, Philippines",
          submitButtonText: "Contact Us",
          successTitle: "Request Received",
          successMessage: "Our operations team will be in touch shortly to schedule your discovery call."
        },
        updatedAt: new Date().toISOString()
      };
      
      await set(contactRef, newData);
      console.log('✅ Successfully created contact section with "Contact Us" button!');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating contact button:', error);
    process.exit(1);
  }
}

updateContactButton();
