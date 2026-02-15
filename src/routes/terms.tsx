import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/terms')({
  component: TermsOfServicePage
})

export default function TermsOfServicePage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight mb-2">Terms of Service</h1>
      <p className="text-muted-foreground text-sm mb-10">Last updated: February 15, 2026</p>

      <div className="space-y-8 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="text-base font-medium text-foreground mb-3">1. Acceptance of Terms</h2>
          <p>
            By accessing or using Ink MCP (&quot;the Service&quot;), you agree to be bound by these
            Terms of Service. If you do not agree to these terms, do not use the Service.
          </p>
        </section>

        <section>
          <h2 className="text-base font-medium text-foreground mb-3">2. Description of Service</h2>
          <p>
            Ink MCP provides a deployment platform that enables AI coding agents to deploy
            applications via the Model Context Protocol (MCP). The Service includes application
            hosting, build pipelines, domain management, and related tools.
          </p>
        </section>

        <section>
          <h2 className="text-base font-medium text-foreground mb-3">3. Account Registration</h2>
          <p>
            You must authenticate with a valid GitHub account to use the Service. You are
            responsible for maintaining the security of your account credentials and for all
            activities that occur under your account.
          </p>
        </section>

        <section>
          <h2 className="text-base font-medium text-foreground mb-3">4. Acceptable Use</h2>
          <p>You agree not to use the Service to:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Deploy applications that violate any applicable laws or regulations</li>
            <li>Host malware, phishing sites, or other malicious content</li>
            <li>Engage in cryptocurrency mining or other resource-abusive activities</li>
            <li>Interfere with or disrupt the Service or its infrastructure</li>
            <li>Circumvent usage limits or access controls</li>
            <li>Resell or redistribute the Service without authorization</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-medium text-foreground mb-3">5. Content and Deployments</h2>
          <p>
            You retain ownership of all code and content you deploy through the Service. You are
            solely responsible for the content of your deployments and ensuring they comply with
            applicable laws. We reserve the right to remove deployments that violate these terms.
          </p>
        </section>

        <section>
          <h2 className="text-base font-medium text-foreground mb-3">6. API Keys and Access</h2>
          <p>
            API keys issued to you are confidential. You are responsible for safeguarding your API
            keys and must not share them publicly. We reserve the right to revoke API keys that are
            compromised or misused.
          </p>
        </section>

        <section>
          <h2 className="text-base font-medium text-foreground mb-3">
            7. Service Availability and Modifications
          </h2>
          <p>
            We strive to maintain high availability but do not guarantee uninterrupted access to the
            Service. We may modify, suspend, or discontinue features of the Service at any time. We
            will provide reasonable notice of material changes when possible.
          </p>
        </section>

        <section>
          <h2 className="text-base font-medium text-foreground mb-3">8. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, Ink MCP shall not be liable for any indirect,
            incidental, special, consequential, or punitive damages, including loss of data,
            revenue, or profits, arising from your use of the Service.
          </p>
        </section>

        <section>
          <h2 className="text-base font-medium text-foreground mb-3">9. Termination</h2>
          <p>
            We may suspend or terminate your access to the Service at any time for violations of
            these terms. You may terminate your account at any time. Upon termination, your
            deployments will be deactivated and associated data will be deleted in accordance with
            our Privacy Policy.
          </p>
        </section>

        <section>
          <h2 className="text-base font-medium text-foreground mb-3">10. Changes to Terms</h2>
          <p>
            We may update these terms from time to time. Continued use of the Service after changes
            constitutes acceptance of the updated terms. We will notify you of material changes by
            posting the updated terms on this page.
          </p>
        </section>

        <section>
          <h2 className="text-base font-medium text-foreground mb-3">11. Contact</h2>
          <p>
            If you have questions about these terms, please contact us at{' '}
            <a href="mailto:legal@ml.ink" className="text-foreground underline">
              legal@ml.ink
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  )
}
