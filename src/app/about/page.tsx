import AboutPage from "@/app/[brand]/about/page";

// 本家用の About ページ (/)
export default function DefaultAbout(props: any) {
  // brand パラメータを "bestie" として固定で渡す
  const params = Promise.resolve({ brand: "bestie" });
  return <AboutPage {...props} params={params} />;
}
