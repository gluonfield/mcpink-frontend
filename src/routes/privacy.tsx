import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/privacy')({
  component: PrivacyPage
})

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight mb-2">Privacy Policy</h1>
      <p className="text-muted-foreground text-sm mb-10">Last updated: February 15, 2026</p>

      <div className="space-y-8 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="text-base font-medium text-foreground mb-3">1. Information We Collect</h2>
          <p>
            When you use Ink MCP, we collect information you provide directly, including your name,
            email address, and GitHub account details through OAuth authentication. We also collect
            usage data such as deployment logs, service configurations, and API usage metrics.
          </p>
        </section>

        <section>
          <h2 className="text-base font-medium text-foreground mb-3">
            2. How We Use Your Information
          </h2>
          <p>We use your information to:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Provide, maintain, and improve our deployment services</li>
            <li>Process your deployments and manage your projects</li>
            <li>Authenticate your identity and manage your account</li>
            <li>Communicate with you about service updates and support</li>
            <li>Monitor and analyze usage trends to improve the platform</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-medium text-foreground mb-3">3. GitHub Integration</h2>
          <p>
            We access your GitHub repositories only with your explicit permission through the GitHub
            App installation. We read repository contents solely to build and deploy your
            applications. We do not store your source code beyond what is necessary for active
            deployments.
          </p>
        </section>

        <section>
          <h2 className="text-base font-medium text-foreground mb-3">4. Data Sharing</h2>
          <p>
            We do not sell your personal information. We may share data with third-party service
            providers who assist in operating our platform (e.g., cloud infrastructure providers),
            but only as necessary to provide our services and under strict confidentiality
            agreements.
          </p>
        </section>

        <section>
          <h2 className="text-base font-medium text-foreground mb-3">5. Data Security</h2>
          <p>
            We implement industry-standard security measures to protect your data, including
            encryption in transit and at rest, secure authentication, and regular security audits.
            API keys and secrets are encrypted and never exposed in logs or responses.
          </p>
        </section>

        <section>
          <h2 className="text-base font-medium text-foreground mb-3">6. Data Retention</h2>
          <p>
            We retain your data for as long as your account is active. Deployment logs are retained
            for 30 days. You may request deletion of your account and associated data at any time by
            contacting us.
          </p>
        </section>

        <section>
          <h2 className="text-base font-medium text-foreground mb-3">7. Your Rights</h2>
          <p>
            You have the right to access, correct, or delete your personal data. You can revoke
            GitHub access at any time through your GitHub settings. You may also request a copy of
            your data or ask us to restrict processing.
          </p>
        </section>

        <section>
          <h2 className="text-base font-medium text-foreground mb-3">8. Cookies</h2>
          <p>
            We use essential cookies for authentication and session management. We do not use
            third-party tracking cookies or advertising cookies.
          </p>
        </section>

        <section>
          <h2 className="text-base font-medium text-foreground mb-3">9. Changes to This Policy</h2>
          <p>
            We may update this privacy policy from time to time. We will notify you of any material
            changes by posting the updated policy on this page and updating the &quot;Last
            updated&quot; date.
          </p>
        </section>

        <section>
          <h2 className="text-base font-medium text-foreground mb-3">10. Contact</h2>
          <p>
            If you have questions about this privacy policy, please contact us at{' '}
            <a href="mailto:privacy@ml.ink" className="text-foreground underline">
              privacy@ml.ink
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  )
}
