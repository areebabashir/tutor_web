import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SEO from '@/components/SEO';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const CookiePolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Cookie Policy - Bizlish | How We Use Cookies & Tracking"
        description="Learn about how Bizlish uses cookies and similar technologies to enhance your learning experience. Our cookie policy explains tracking, preferences, and your choices."
        keywords="cookie policy, cookies, tracking, web analytics, user preferences, Bizlish cookies, data collection"
        ogTitle="Cookie Policy - Bizlish Cookie Usage"
        ogDescription="Understand how we use cookies to improve your English learning experience. Learn about our cookie practices and your control options."
        canonical="https://bizlish.com/cookie-policy"
      />
      <Navbar />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-center mb-4">Cookie Policy</CardTitle>
              <p className="text-muted-foreground text-center">Last updated: January 2025</p>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none">
              <h2>1. What Are Cookies?</h2>
              <p>
                Cookies are small text files that are placed on your computer or mobile device when 
                you visit a website. They are widely used to make websites work more efficiently and 
                to provide information to website owners.
              </p>

              <h2>2. How We Use Cookies</h2>
              <p>
                Bizlish uses cookies and similar technologies to enhance your learning experience, 
                analyze usage patterns, and provide personalized content. We use cookies for the 
                following purposes:
              </p>

              <h3>2.1 Essential Cookies</h3>
              <p>These cookies are necessary for the website to function properly:</p>
              <ul>
                <li>Authentication and login sessions</li>
                <li>Security and fraud prevention</li>
                <li>Load balancing and performance</li>
                <li>User preferences and settings</li>
              </ul>

              <h3>2.2 Analytics Cookies</h3>
              <p>We use analytics cookies to understand how users interact with our platform:</p>
              <ul>
                <li>Page views and user journeys</li>
                <li>Feature usage and engagement</li>
                <li>Performance monitoring</li>
                <li>Error tracking and debugging</li>
              </ul>

              <h3>2.3 Functional Cookies</h3>
              <p>These cookies enhance your experience by remembering your preferences:</p>
              <ul>
                <li>Language and region settings</li>
                <li>Course progress and bookmarks</li>
                <li>Customized learning paths</li>
                <li>Accessibility preferences</li>
              </ul>

              <h3>2.4 Marketing Cookies</h3>
              <p>We may use cookies for marketing purposes:</p>
              <ul>
                <li>Personalized course recommendations</li>
                <li>Targeted advertisements</li>
                <li>Social media integration</li>
                <li>Email campaign tracking</li>
              </ul>

              <h2>3. Types of Cookies We Use</h2>
              <h3>3.1 Session Cookies</h3>
              <p>
                These are temporary cookies that expire when you close your browser. They help 
                maintain your session while using our platform.
              </p>

              <h3>3.2 Persistent Cookies</h3>
              <p>
                These cookies remain on your device for a set period or until you delete them. 
                They remember your preferences across multiple visits.
              </p>

              <h3>3.3 Third-Party Cookies</h3>
              <p>
                We may use third-party services that set their own cookies, including:
              </p>
              <ul>
                <li>Google Analytics for website analytics</li>
                <li>Social media platforms for sharing features</li>
                <li>Payment processors for transaction security</li>
                <li>Content delivery networks for performance</li>
              </ul>

              <h2>4. Your Cookie Choices</h2>
              <h3>4.1 Browser Settings</h3>
              <p>
                You can control cookies through your browser settings. Most browsers allow you to:
              </p>
              <ul>
                <li>View and delete existing cookies</li>
                <li>Block cookies from specific websites</li>
                <li>Block all cookies</li>
                <li>Receive notifications when cookies are set</li>
              </ul>

              <h3>4.2 Cookie Consent</h3>
              <p>
                When you first visit our website, you'll see a cookie consent banner. You can:
              </p>
              <ul>
                <li>Accept all cookies</li>
                <li>Reject non-essential cookies</li>
                <li>Customize your cookie preferences</li>
                <li>Change your preferences at any time</li>
              </ul>

              <h2>5. Impact of Disabling Cookies</h2>
              <p>
                If you choose to disable cookies, some features of our platform may not work 
                properly:
              </p>
              <ul>
                <li>You may need to log in repeatedly</li>
                <li>Your learning progress may not be saved</li>
                <li>Personalized content may not be available</li>
                <li>Some interactive features may not function</li>
              </ul>

              <h2>6. Third-Party Services</h2>
              <p>
                Our platform may contain links to third-party websites or integrate with 
                third-party services. These services have their own cookie policies, which 
                we encourage you to review.
              </p>

              <h2>7. Updates to This Policy</h2>
              <p>
                We may update this Cookie Policy from time to time to reflect changes in our 
                practices or for other operational, legal, or regulatory reasons. We will 
                notify you of any significant changes.
              </p>

              <h2>8. Contact Us</h2>
              <p>
                If you have any questions about our use of cookies, please contact us at:
              </p>
              <ul>
                <li>Email: bizlishofficial@gmail.com</li>
                <li>Phone: +92 318 5078571</li>
              </ul>

              <h2>9. Browser-Specific Instructions</h2>
              <h3>9.1 Chrome</h3>
              <p>Settings → Privacy and security → Cookies and other site data</p>

              <h3>9.2 Firefox</h3>
              <p>Options → Privacy & Security → Cookies and Site Data</p>

              <h3>9.3 Safari</h3>
              <p>Preferences → Privacy → Manage Website Data</p>

              <h3>9.4 Edge</h3>
              <p>Settings → Cookies and site permissions → Cookies and site data</p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default CookiePolicy;
