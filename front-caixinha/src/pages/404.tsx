import Link from 'next/link';
export default function NotFoundPage() {
    return (
        <div>
            <h1>Ops, página não encontrada!</h1>
            <p>A página que você está procurando não existe.</p>
            <Link href="/">Voltar à página inicial</Link>
        </div>
    );
};


