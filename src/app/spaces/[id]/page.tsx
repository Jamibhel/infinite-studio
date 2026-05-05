import { SpaceDetailPage } from "@/components/SpaceDetailPage"

export default function Page({ params }: { params: { id: string } }) {
  return <SpaceDetailPage spaceId={params.id} />
}
