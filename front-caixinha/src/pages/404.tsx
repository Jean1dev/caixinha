import Link from 'next/link';
export default function NotFoundPage() {
    return (
        <div>
            <h1>Ops, Parece que tivemos um problema por aqui!</h1>
            <img
                alt="Under development"
                src="/assets/error-404.png"
                style={{
                    display: 'inline-block',
                    maxWidth: '100%',
                    width: 250
                }}
            />
            <Link href="/">Voltar à página inicial</Link>
        </div>
    );
};


