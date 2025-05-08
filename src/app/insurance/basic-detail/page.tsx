import { PolicyDetail } from './PolicyDetail';
interface PolicyDetailPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function PolicyDetailPage({
  searchParams,
}: PolicyDetailPageProps) {
  const params = searchParams;
  const isManual = params?.manual === 'true' ? true : false;

  return <PolicyDetail isSingPassFlow={!isManual} />;
}
