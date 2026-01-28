import AboutPage from "@/app/[brand]/about/page";

export const runtime = 'edge';

// ルートの About ページ (/about)
export default function DefaultAbout(props: any) {
  const params = Promise.resolve({ brand: "bestie" });
  return <AboutPage {...props} params={params} />;
}
