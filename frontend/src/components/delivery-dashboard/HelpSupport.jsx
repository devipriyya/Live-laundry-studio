import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  InformationCircleIcon, 
  LightBulbIcon, 
  ChatBubbleLeftRightIcon,
  PhoneIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';

const HelpSupport = () => {
  const { t } = useTranslation();

  const faqs = [
    {
      question: t('faq_how_to_update_status'),
      answer: t('faq_how_to_update_status_answer')
    },
    {
      question: t('faq_how_to_report_issue'),
      answer: t('faq_how_to_report_issue_answer')
    },
    {
      question: t('faq_how_to_contact_support'),
      answer: t('faq_how_to_contact_support_answer')
    },
    {
      question: t('faq_payment_questions'),
      answer: t('faq_payment_questions_answer')
    }
  ];

  return (
    <div className="space-y-6">
      {/* Help Center Header */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold">{t('help_center')}</h1>
            <p className="mt-1 opacity-90">{t('how_can_we_help_you')}</p>
          </div>
          <div className="mt-4 md:mt-0">
            <button className="px-4 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-100 transition-colors">
              {t('contact_us')}
            </button>
          </div>
        </div>
      </div>

      {/* Quick Help */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <InformationCircleIcon className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="font-medium text-gray-900 mt-4">{t('getting_started')}</h3>
          <p className="text-sm text-gray-600 mt-1">{t('getting_started_desc')}</p>
          <button className="mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium">
            {t('learn_more')}
          </button>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <LightBulbIcon className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="font-medium text-gray-900 mt-4">{t('tips_tricks')}</h3>
          <p className="text-sm text-gray-600 mt-1">{t('tips_tricks_desc')}</p>
          <button className="mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium">
            {t('view_all')}
          </button>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <ChatBubbleLeftRightIcon className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="font-medium text-gray-900 mt-4">{t('live_chat')}</h3>
          <p className="text-sm text-gray-600 mt-1">{t('live_chat_desc')}</p>
          <button className="mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium">
            {t('start_chat')}
          </button>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
          <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
            <PhoneIcon className="w-6 h-6 text-amber-600" />
          </div>
          <h3 className="font-medium text-gray-900 mt-4">{t('call_support')}</h3>
          <p className="text-sm text-gray-600 mt-1">{t('call_support_desc')}</p>
          <button className="mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium">
            {t('call_now')}
          </button>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">{t('frequently_asked_questions')}</h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-gray-200 rounded-lg">
              <button className="w-full flex justify-between items-center p-4 text-left hover:bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-900">{faq.question}</span>
                <svg className="w-5 h-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              <div className="px-4 pb-4 text-gray-600 hidden">
                {faq.answer}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Support */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">{t('contact_support')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border border-gray-200 rounded-lg p-5">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <ChatBubbleLeftRightIcon className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-medium text-gray-900 mt-4">{t('live_chat')}</h3>
            <p className="text-sm text-gray-600 mt-1">{t('available_24_7')}</p>
            <button className="mt-3 w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
              {t('start_chat')}
            </button>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-5">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <PhoneIcon className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-medium text-gray-900 mt-4">{t('phone_support')}</h3>
            <p className="text-sm text-gray-600 mt-1">{t('phone_support_desc')}</p>
            <button className="mt-3 w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium">
              {t('call_now')}
            </button>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-5">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <EnvelopeIcon className="w-6 h-6 text-amber-600" />
            </div>
            <h3 className="font-medium text-gray-900 mt-4">{t('email_support')}</h3>
            <p className="text-sm text-gray-600 mt-1">{t('email_support_desc')}</p>
            <button className="mt-3 w-full py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 text-sm font-medium">
              {t('send_email')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpSupport;