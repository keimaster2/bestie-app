import AboutPage from "../[brand]/about/page";

export const runtime = 'edge';

// サブドメインおよび本家用の紹介ページ
export default async function DefaultAbout(props: any) {
  // brand を空で渡す（遷移先のコンポーネント側でホスト名から自動判定される）
  const params = props.params ? props.params.then((p: any) => ({ ...p, brand: "" })) : Promise.resolve({ brand: "" });
  return <AboutPage {...props} params={params} />;
}
