import React, { useState } from 'react';
import { DocumentTextIcon, ShieldCheckIcon, EyeIcon, XMarkIcon } from '@heroicons/react/24/outline';

const DashboardLegal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);

  // Sample legal content
  const legalDocuments = {
    terms: {
      title: "Terms of Service",
      content: `
        <h2 class="text-xl font-bold mb-4">1. Acceptance of Terms</h2>
        <p class="mb-4">By accessing and using WashLab's services, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using WashLab's services, you shall be subject to any posted guidelines or rules applicable to such services.</p>
        
        <h2 class="text-xl font-bold mb-4">2. Services</h2>
        <p class="mb-4">WashLab provides professional laundry and dry cleaning services. We reserve the right to modify or discontinue, temporarily or permanently, the service with or without notice.</p>
        
        <h2 class="text-xl font-bold mb-4">3. User Responsibilities</h2>
        <p class="mb-4">You are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer, and you agree to accept responsibility for all activities that occur under your account or password.</p>
        
        <h2 class="text-xl font-bold mb-4">4. Service Guarantee</h2>
        <p class="mb-4">WashLab guarantees the quality of our service. If you are not satisfied with our service, please contact us within 48 hours of receiving your order, and we will re-process or refund your order.</p>
        
        <h2 class="text-xl font-bold mb-4">5. Limitation of Liability</h2>
        <p class="mb-4">WashLab shall not be liable for any direct, indirect, incidental, special or consequential damages resulting from the use or the inability to use any of our services.</p>
      `
    },
    privacy: {
      title: "Privacy Policy",
      content: `
        <h2 class="text-xl font-bold mb-4">1. Information Collection</h2>
        <p class="mb-4">We collect information you provide directly to us, such as when you create an account, use our services, or communicate with us. This includes your name, email address, phone number, and payment information.</p>
        
        <h2 class="text-xl font-bold mb-4">2. Information Usage</h2>
        <p class="mb-4">We use the information we collect to provide, maintain, and improve our services, to process transactions, to communicate with you, and to comply with legal obligations.</p>
        
        <h2 class="text-xl font-bold mb-4">3. Information Sharing</h2>
        <p class="mb-4">We do not share your personal information with third parties except to provide our services, comply with the law, or protect our rights. We may share anonymous, aggregated information with partners.</p>
        
        <h2 class="text-xl font-bold mb-4">4. Data Security</h2>
        <p class="mb-4">We implement appropriate security measures to protect against unauthorized access to or unauthorized alteration, disclosure or destruction of data.</p>
        
        <h2 class="text-xl font-bold mb-4">5. Your Rights</h2>
        <p class="mb-4">You have the right to access, update, or delete your personal information at any time. You may also opt out of marketing communications.</p>
      `
    },
    refund: {
      title: "Refund Policy",
      content: `
        <h2 class="text-xl font-bold mb-4">1. General Policy</h2>
        <p class="mb-4">WashLab offers a 100% satisfaction guarantee. If you are not satisfied with our service, we will re-process your order or provide a full refund.</p>
        
        <h2 class="text-xl font-bold mb-4">2. Claim Process</h2>
        <p class="mb-4">To initiate a refund claim, contact our customer service within 48 hours of receiving your order. You must provide your order number and a description of the issue.</p>
        
        <h2 class="text-xl font-bold mb-4">3. Refund Conditions</h2>
        <p class="mb-4">Refunds are provided for: damage during service, loss of items, failure to meet service standards, or customer dissatisfaction when reported promptly.</p>
        
        <h2 class="text-xl font-bold mb-4">4. Non-Refundable Items</h2>
        <p class="mb-4">Certain items may be non-refundable including: items already damaged when received, items left for more than 30 days, or items that violate our prohibited items policy.</p>
        
        <h2 class="text-xl font-bold mb-4">5. Refund Timeline</h2>
        <p class="mb-4">Approved refunds are processed within 5-7 business days. Refunds will be issued to the original payment method.</p>
      `
    }
  };

  const openDocument = (docType) => {
    setSelectedDocument(legalDocuments[docType]);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDocument(null);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Legal Information</h1>
        <p className="text-gray-600 mt-2">Terms, policies, and legal documents</p>
      </div>

      {/* Legal Documents */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-3 mb-4">
            <DocumentTextIcon className="h-8 w-8 text-blue-600" />
            <h3 className="text-lg font-bold text-gray-900">Terms of Service</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Our comprehensive terms and conditions for using WashLab services, including service agreements, user obligations, and company policies.
          </p>
          <button 
            onClick={() => openDocument('terms')}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Read Terms →
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-3 mb-4">
            <ShieldCheckIcon className="h-8 w-8 text-green-600" />
            <h3 className="text-lg font-bold text-gray-900">Privacy Policy</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Our detailed privacy policy explaining how we collect, use, store, and protect your personal information in compliance with data protection regulations.
          </p>
          <button 
            onClick={() => openDocument('privacy')}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Read Policy →
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-3 mb-4">
            <EyeIcon className="h-8 w-8 text-purple-600" />
            <h3 className="text-lg font-bold text-gray-900">Refund Policy</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Our clear refund and cancellation policy outlining the conditions under which refunds are provided and the process for cancellations.
          </p>
          <button 
            onClick={() => openDocument('refund')}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Read Policy →
          </button>
        </div>
      </div>

      {/* Quick Legal Info */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Important Legal Information</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Service Agreement</h3>
            <p className="text-gray-700">
              By using WashLab services, you agree to our terms of service and privacy policy. 
              We are committed to providing transparent, fair, and professional laundry services to all customers with complete accountability.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Liability</h3>
            <p className="text-gray-700">
              WashLab takes full responsibility for garments in our care. We maintain comprehensive 
              insurance coverage and follow strict quality control procedures to ensure the highest standards of service.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Data Protection</h3>
            <p className="text-gray-700">
              We comply with all applicable data protection laws including GDPR and local privacy regulations, maintaining the highest standards 
              of data security to protect your personal information.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Legal */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Legal Inquiries</h3>
        <p className="text-gray-600 mb-4">
          For legal questions or concerns, please contact our legal department:
        </p>
        <div className="text-sm text-gray-700">
          <p>Email: washlab041@gmail.com</p>
          <p>Phone: 917907425691</p>
          <p>Address: Machiplavu P O , Chattupara</p>
          <p>Adimaly , Idukki 685561</p>
        </div>
      </div>

      {/* Document Modal */}
      {isModalOpen && selectedDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">{selectedDocument.title}</h2>
              <button 
                onClick={closeModal}
                className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="overflow-y-auto p-6">
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: selectedDocument.content }} />
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardLegal;