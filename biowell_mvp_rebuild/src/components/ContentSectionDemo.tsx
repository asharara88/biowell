import React from 'react';
import ContentSection from './ContentSection';
import GradientSection from './GradientSection';

export default function ContentSectionDemo() {
  return (
    <div className="p-8 space-y-12">
      {/* Light Variant */}
      <ContentSection
        title="Clear and Engaging Title"
        subtitle="A compelling subtitle that provides additional context and draws readers in"
        variant="light"
      >
        <div className="space-y-6">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis 
            nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
          <p>
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore 
            eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt 
            in culpa qui officia deserunt mollit anim id est laborum.
          </p>
          <ul className="list-disc list-inside">
            <li>First important point with key details</li>
            <li>Second point highlighting another aspect</li>
            <li>Third point bringing additional value</li>
          </ul>
        </div>
      </ContentSection>

      {/* Dark Variant in Gradient Section */}
      <GradientSection variant="secondary" padding="xl">
        <ContentSection
          title="Dark Theme Content"
          subtitle="Elegant and readable content presentation on dark backgrounds"
          variant="dark"
          align="center"
        >
          <div className="space-y-6">
            <p>
              Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere 
              cubilia curae; Proin facilisis, velit non fringilla pharetra, elit odio 
              accumsan nunc, vitae lacinia nisl lorem eu nisl.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-white mb-3">Feature One</h3>
                <p className="text-gray-400">Detailed description of the first feature and its benefits.</p>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-white mb-3">Feature Two</h3>
                <p className="text-gray-400">Explanation of the second feature's unique value proposition.</p>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-white mb-3">Feature Three</h3>
                <p className="text-gray-400">Overview of the third feature and its advantages.</p>
              </div>
            </div>
          </div>
        </ContentSection>
      </GradientSection>
    </div>
  );
}