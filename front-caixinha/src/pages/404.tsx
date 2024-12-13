import { useTranslations } from '@/hooks/useTranlations';
import Link from 'next/link';

export default function NotFoundPage() {
    const { t } = useTranslations();

    return (
        <div>
            <h1>{t.not_fount}</h1>
            <img
                alt="Under development"
                src="/assets/error-404.png"
                style={{
                    display: 'inline-block',
                    maxWidth: '100%',
                    width: 250
                }}
            />
            <Link href="/">{t.voltar}</Link>
        </div>
    );
};


