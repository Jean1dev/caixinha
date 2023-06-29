import Head from 'next/head';

export const Seo = (props: any) => {
  const { title } = props;

  const fullTitle = title
    ? title + ' | Caixinha App'
    : 'Caixinha App';

  return (
    <Head>
      <title>
        {fullTitle}
      </title>
    </Head>
  );
};

