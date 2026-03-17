import React from 'react';
import { motion } from 'framer-motion';
import { Scale, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const TermsOfServicePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#E4E3E0] pt-24 pb-20 px-4">
      <Helmet>
        <title>Terms of Service | Tamil Pulse</title>
        <meta name="description" content="Terms of Service for Tamil Pulse. Guidelines for using our community platform." />
      </Helmet>

      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2.5rem] p-8 sm:p-12 shadow-xl border border-[#141414]/5 space-y-12"
        >
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto text-blue-600">
              <Scale size={32} />
            </div>
            <h1 className="text-4xl font-black text-zinc-900 tracking-tight uppercase">Terms of Service</h1>
            <p className="text-zinc-500 font-medium">Last Updated: March 17, 2026</p>
          </div>

          <div className="space-y-8 text-zinc-700 leading-relaxed">
            <section className="space-y-4">
              <h2 className="text-xl font-black text-zinc-900 uppercase tracking-wider flex items-center gap-2">
                <Info size={20} className="text-blue-500" />
                1. Acceptance of Terms
              </h2>
              <p>
                By accessing or using Tamil Pulse, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you must not use the platform.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-black text-zinc-900 uppercase tracking-wider flex items-center gap-2">
                <AlertCircle size={20} className="text-amber-500" />
                2. Platform Disclaimer
              </h2>
              <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-xl">
                <p className="text-amber-900 font-medium text-sm">
                  Tamil Pulse is a community-driven public opinion hub. It is NOT an official government tool, NOT a registered polling agency, and is NOT affiliated with the Election Commission of India or any political party. The data presented reflects the opinions of our users and should not be taken as a scientific prediction of election results.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-black text-zinc-900 uppercase tracking-wider flex items-center gap-2">
                <CheckCircle size={20} className="text-emerald-500" />
                3. User Conduct
              </h2>
              <p>
                We encourage healthy debate and diverse opinions. However, users must adhere to the following rules:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>No Hate Speech:</strong> Content promoting violence, hatred, or discrimination based on caste, religion, gender, or ethnicity is strictly prohibited.</li>
                <li><strong>No Spam:</strong> Do not flood the forums or battle arena with repetitive or promotional content.</li>
                <li><strong>No Impersonation:</strong> Do not attempt to impersonate political figures, government officials, or other users.</li>
                <li><strong>Respect Privacy:</strong> Do not share personal information (PII) of others.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-black text-zinc-900 uppercase tracking-wider">
                4. Content Ownership
              </h2>
              <p>
                By posting content (comments, forum topics) on Tamil Pulse, you grant us a non-exclusive, royalty-free, perpetual license to display and distribute that content on our platform. You remain the owner of your original content.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-black text-zinc-900 uppercase tracking-wider">
                5. Limitation of Liability
              </h2>
              <p>
                Tamil Pulse is provided "as is" without any warranties. We are not liable for any damages arising from your use of the platform, including but not limited to inaccuracies in data, user-generated content, or service interruptions.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-black text-zinc-900 uppercase tracking-wider">
                6. Modifications to Service
              </h2>
              <p>
                We reserve the right to modify or discontinue any part of the service at any time without notice. We may also update these Terms of Service periodically.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsOfServicePage;
