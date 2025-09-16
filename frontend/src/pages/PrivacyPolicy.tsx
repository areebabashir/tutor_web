import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SEO from '@/components/SEO';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Privacy Policy - Bizlish | Your Data Protection Rights"
        description="Learn how Bizlish protects your personal information and respects your privacy. Our comprehensive privacy policy outlines data collection, usage, and protection practices."
        keywords="privacy policy, data protection, personal information, GDPR compliance, user privacy, Bizlish privacy"
        ogTitle="Privacy Policy - Bizlish Data Protection"
        ogDescription="Your privacy matters to us. Learn how we protect and handle your personal information at Bizlish."
        canonical="https://bizlish.com/privacy-policy"
      />
      <Navbar />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-center mb-4">Privacy Policy</CardTitle>
              <p className="text-muted-foreground text-center">Last updated: January 2025</p>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none">
              <h2>1. Introduction</h2>
              <p>
                Welcome to Bizlish ("we," "our," or "us"). This Privacy Policy explains how we collect, 
                use, disclose, and safeguard your information when you visit our website and use our 
                English learning services.
              </p>

              <h2>2. Information We Collect</h2>
              <h3>2.1 Personal Information</h3>
              <p>We may collect the following personal information:</p>
              <ul>
                <li>Name and contact information (email, phone number)</li>
                <li>Account credentials and profile information</li>
                <li>Payment and billing information</li>
                <li>Learning progress and course completion data</li>
                <li>Communication preferences</li>
              </ul>

              <h3>2.2 Automatically Collected Information</h3>
              <p>We automatically collect certain information when you use our services:</p>
              <ul>
                <li>Device information and IP address</li>
                <li>Browser type and version</li>
                <li>Usage patterns and interaction data</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>

              <h2>3. How We Use Your Information</h2>
              <p>We use your information to:</p>
              <ul>
                <li>Provide and improve our English learning services</li>
                <li>Process payments and manage your account</li>
                <li>Send important updates and notifications</li>
                <li>Personalize your learning experience</li>
                <li>Analyze usage patterns to enhance our platform</li>
                <li>Comply with legal obligations</li>
              </ul>

              <h2>4. Information Sharing</h2>
              <p>We do not sell, trade, or rent your personal information to third parties. We may share 
              your information only in the following circumstances:</p>
              <ul>
                <li>With your explicit consent</li>
                <li>To comply with legal requirements</li>
                <li>With trusted service providers who assist in our operations</li>
                <li>In case of business transfers or mergers</li>
              </ul>

              <h2>5. Data Security</h2>
              <p>
                We implement appropriate security measures to protect your personal information against 
                unauthorized access, alteration, disclosure, or destruction. However, no method of 
                transmission over the internet is 100% secure.
              </p>

              <h2>6. Your Rights</h2>
              <p>You have the right to:</p>
              <ul>
                <li>Access and update your personal information</li>
                <li>Request deletion of your account and data</li>
                <li>Opt-out of marketing communications</li>
                <li>Request data portability</li>
                <li>Withdraw consent at any time</li>
              </ul>

              <h2>7. Cookies and Tracking</h2>
              <p>
                We use cookies and similar technologies to enhance your experience, analyze usage, 
                and provide personalized content. You can control cookie settings through your browser.
              </p>

              <h2>8. Children's Privacy</h2>
              <p>
                Our services are not intended for children under 13. We do not knowingly collect 
                personal information from children under 13.
              </p>

              <h2>9. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any 
                changes by posting the new policy on this page and updating the "Last updated" date.
              </p>

              <h2>10. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at:
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

export default PrivacyPolicy;
