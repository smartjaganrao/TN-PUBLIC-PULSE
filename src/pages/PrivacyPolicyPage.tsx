import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, FileText } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#E4E3E0] pt-24 pb-20 px-4">
      <Helmet>
        <title>Privacy Policy | Tamil Pulse</title>
        <meta name="description" content="Privacy Policy for Tamil Pulse. Learn how we protect your anonymity and handle data." />
      </Helmet>

      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2.5rem] p-8 sm:p-12 shadow-xl border border-[#141414]/5 space-y-12"
        >
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto text-emerald-600">
              <Shield size={32} />
            </div>
            <h1 className="text-4xl font-black text-zinc-900 tracking-tight uppercase">Privacy Policy</h1>
            <p className="text-zinc-500 font-medium">Last Updated: March 17, 2026</p>
          </div>

          <div className="space-y-8 text-zinc-700 leading-relaxed">
            <section className="space-y-4">
              <h2 className="text-xl font-black text-zinc-900 uppercase tracking-wider flex items-center gap-2">
                <Lock size={20} className="text-emerald-500" />
                1. Our Commitment to Anonymity
              </h2>
              <p>
                Tamil Pulse is built on the principle of absolute anonymity. We believe that public opinion is most honest when individuals feel safe. We do not require you to create an account, provide your real name, or share your email address to participate in our polls or community discussions.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-black text-zinc-900 uppercase tracking-wider flex items-center gap-2">
                <Eye size={20} className="text-emerald-500" />
                2. Data We Collect
              </h2>
              <p>
                To ensure the integrity of our polls and prevent duplicate voting, we collect minimal technical data:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Device Identifier:</strong> A unique, anonymized ID stored in your browser's local storage to prevent multiple votes from the same device.</li>
                <li><strong>Poll Responses:</strong> Your selected party and district choices.</li>
                <li><strong>Community Content:</strong> Nicknames and comments you choose to post in our forums or pulse arena.</li>
                <li><strong>Usage Stats:</strong> General analytics such as page views and visitor counts to improve platform performance.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-black text-zinc-900 uppercase tracking-wider flex items-center gap-2">
                <FileText size={20} className="text-emerald-500" />
                3. How We Use Data
              </h2>
              <p>
                The data collected is used exclusively for:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Generating real-time public opinion trends and visualizations.</li>
                <li>Maintaining the functionality of the community forum and battle arena.</li>
                <li>Preventing spam and fraudulent voting activities.</li>
                <li>Improving the user experience of the Tamil Pulse platform.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-black text-zinc-900 uppercase tracking-wider">
                4. Third-Party Services
              </h2>
              <p>
                We use Firebase (a Google service) for our database and hosting. Firebase may collect certain technical data as part of its standard operations. We also use standard web analytics to understand traffic patterns. We do not sell your data to third parties.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-black text-zinc-900 uppercase tracking-wider">
                5. Cookies and Local Storage
              </h2>
              <p>
                We use local storage to remember your voting status and language preferences. These are essential for the platform's core functionality.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-black text-zinc-900 uppercase tracking-wider">
                6. Contact Us
              </h2>
              <p>
                If you have any questions about this Privacy Policy, you can reach out to the community moderators through the official social media channels listed in our footer.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
