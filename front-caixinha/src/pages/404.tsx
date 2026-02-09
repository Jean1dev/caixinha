import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

export default function NotFoundPage() {
    const { t } = useTranslation();

    return (
        <div>
            <h1>{t('not_found')}</h1>
            <Image
                alt="Under development"
                src="/assets/error-404.png"
                width={250}
                height={250}
                style={{
                    display: 'inline-block',
                    maxWidth: '100%'
                }}
            />
            <Link href="/">{t('voltar')}</Link>
        </div>
    );
};


