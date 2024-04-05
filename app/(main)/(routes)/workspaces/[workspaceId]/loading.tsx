'use client';
import SideNav from '@/components/sideNav/SideNav';
type PanelGroupSizes = Record<string, [number, number]>;

export default function Loading() {
  const localStorageValue = localStorage.getItem('PanelGroup:sizes:mainScreen');

  // Parse the JSON string and extract the desired values
  let widthPercentages: [number, number] = [0, 0]; // Default values
  if (localStorageValue) {
    const parsedValue: PanelGroupSizes = JSON.parse(localStorageValue);
    widthPercentages = parsedValue['1:{"defaultSizePercentage":25},2:{}'];
  }

  return (
    <div className="h-screen min-h-full bg-ui-bg-base text-ui-fg-base">
      <div className={`h-screen w-44 ${widthPercentages[0]}%`}>
        <SideNav />
      </div>
      <div className={`${widthPercentages[1]}%`}>dsdsds</div>
    </div>
  );
}
