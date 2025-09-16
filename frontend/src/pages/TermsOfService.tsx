import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SEO from '@/components/SEO';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Terms of Service - Bizlish | User Agreement & Conditions"
        description="Read our Terms of Service to understand your rights and responsibilities when using Bizlish English learning platform. User agreement, conditions, and policies."
        keywords="terms of service, user agreement, conditions, Bizlish terms, English learning terms, platform rules"
        ogTitle="Terms of Service - Bizlish User Agreement"
        ogDescription="Understand your rights and responsibilities when using Bizlish. Read our comprehensive terms of service and user agreement."
        canonical="https://bizlish.com/terms-of-service"
      />
      <Navbar />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-center mb-4">Terms of Service</CardTitle>
              <p className="text-muted-foreground text-center">Last updated: January 2025</p>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none">
              <h2>1. Acceptance of Terms</h2>
              <p>
                By accessing and using Bizlish ("the Service"), you accept and agree to be bound by 
                the terms and provision of this agreement. If you do not agree to abide by the above, 
                please do not use this service.
              </p>

              <h2>2. Description of Service</h2>
              <p>
                Bizlish provides online English learning services including but not limited to:
              </p>
              <ul>
                <li>IELTS preparation courses</li>
                <li>Spoken English training</li>
                <li>Competitive exam preparation</li>
                <li>GRE vocabulary courses</li>
                <li>Interactive quizzes and assessments</li>
                <li>Study materials and resources</li>
              </ul>

              <h2>3. User Accounts</h2>
              <h3>3.1 Account Creation</h3>
              <p>
                To access certain features of the Service, you must create an account. You agree to 
                provide accurate, current, and complete information during registration.
              </p>

              <h3>3.2 Account Security</h3>
              <p>
                You are responsible for maintaining the confidentiality of your account credentials 
                and for all activities that occur under your account.
              </p>

              <h2>4. Payment Terms</h2>
              <h3>4.1 Fees</h3>
              <p>
                Access to certain courses and features requires payment of fees. All fees are 
                non-refundable unless otherwise specified.
              </p>

              <h3>4.2 Billing</h3>
              <p>
                You agree to pay all charges incurred by your account, including applicable taxes. 
                We reserve the right to change our pricing with reasonable notice.
              </p>

              <h2>5. User Conduct</h2>
              <p>You agree not to:</p>
              <ul>
                <li>Use the Service for any unlawful purpose</li>
                <li>Interfere with or disrupt the Service</li>
                <li>Attempt to gain unauthorized access to any part of the Service</li>
                <li>Share your account credentials with others</li>
                <li>Upload or transmit harmful or malicious content</li>
                <li>Violate any applicable laws or regulations</li>
              </ul>

              <h2>6. Intellectual Property</h2>
              <h3>6.1 Our Content</h3>
              <p>
                All content, materials, and intellectual property on the Service are owned by Bizlish 
                or our licensors and are protected by copyright and other intellectual property laws.
              </p>

              <h3>6.2 User Content</h3>
              <p>
                You retain ownership of content you submit to the Service, but grant us a license to 
                use, modify, and distribute such content for the purpose of providing the Service.
              </p>

              <h2>7. Privacy</h2>
              <p>
                Your privacy is important to us. Please review our Privacy Policy, which also governs 
                your use of the Service, to understand our practices.
              </p>

              <h2>8. Disclaimers</h2>
              <p>
                THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, 
                EITHER EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED 
                OR ERROR-FREE.
              </p>

              <h2>9. Limitation of Liability</h2>
              <p>
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, BIZLISH SHALL NOT BE LIABLE FOR ANY INDIRECT, 
                INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES RESULTING FROM YOUR USE OF 
                THE SERVICE.
              </p>

              <h2>10. Termination</h2>
              <p>
                We may terminate or suspend your account and access to the Service immediately, 
                without prior notice, for any reason, including breach of these Terms.
              </p>

              <h2>11. Changes to Terms</h2>
              <p>
                We reserve the right to modify these Terms at any time. We will notify users of 
                significant changes via email or through the Service.
              </p>

              <h2>12. Governing Law</h2>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of 
                Pakistan, without regard to conflict of law principles.
              </p>

              <h2>13. Contact Information</h2>
              <p>
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <ul>
                <li>Email: bizlishofficial@gmail.com</li>
                <li>Phone: +92 318 5078571</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default TermsOfService;
