import Link from 'next/link';
import { useTranslation } from 'react-i18next';

export default function NotFoundPage() {
    const { t } = useTranslation();

    return (
        <div>
            <h1>{t('not_found')}</h1>
            <img
                alt="Under development"
                src="/assets/error-404.png"
                style={{
                    display: 'inline-block',
                    maxWidth: '100%',
                    width: 250
                }}
            />
            <Link href="/">{t('voltar')}</Link>
        </div>
    );
};


