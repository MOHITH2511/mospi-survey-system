import { useStore } from '../../store/useStore';
import { getTranslation } from '../../lib/i18n';

export function GovFooter() {
  const { language } = useStore();
  const t = (key: any) => getTranslation(key, language);

  return (
    <footer className="bg-slate-900 text-slate-300 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold text-white mb-4">{t('about')}</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white">About MoSPI</a></li>
              <li><a href="#" className="hover:text-white">Mission & Vision</a></li>
              <li><a href="#" className="hover:text-white">Organisation</a></li>
              <li><a href="#" className="hover:text-white">Annual Reports</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">{t('surveys')}</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white">Active Surveys</a></li>
              <li><a href="#" className="hover:text-white">Survey Calendar</a></li>
              <li><a href="#" className="hover:text-white">Methodology</a></li>
              <li><a href="#" className="hover:text-white">Data Access</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white">User Guide</a></li>
              <li><a href="#" className="hover:text-white">Training Materials</a></li>
              <li><a href="#" className="hover:text-white">FAQs</a></li>
              <li><a href="#" className="hover:text-white">Technical Support</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white">{t('privacyPolicy')}</a></li>
              <li><a href="#" className="hover:text-white">{t('termsOfService')}</a></li>
              <li><a href="#" className="hover:text-white">{t('accessibilityStatement')}</a></li>
              <li><a href="#" className="hover:text-white">{t('sitemap')}</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-8 text-sm text-center">
          <p>{t('copyRight')}</p>
          <p className="mt-2 text-slate-400">
            Best viewed in Chrome, Firefox, Safari and Microsoft Edge (latest versions)
          </p>
        </div>
      </div>
    </footer>
  );
}
