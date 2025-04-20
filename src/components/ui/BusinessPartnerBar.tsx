import { Button } from 'antd';
import ArrowBackIcon from "@/components/ui/icons/ArrowBackIcon";

interface BusinessPartnerBarProps {
    businessName?: string;
    companyName?: string;
    onBackClick?: () => void;
    onSaveClick?: () => void;
}

export default function BusinessPartnerBar({
                                businessName = "Business Partner Name",
                                companyName = "Leo Management Consultancy Pte Ltd",
                                onBackClick,
                                onSaveClick,
                            }: BusinessPartnerBarProps) {
    return (
        <div
            className="fixed top-0 left-0 w-full bg-white shadow-md z-50 py-3 flex flex-row items-center justify-between px-8">
            <Button type="text" shape="circle" icon={<ArrowBackIcon/>} onClick={onBackClick}/>
            <div className="text-left">
                <div className="text-base">{businessName}</div>
                <div className="text-sm font-semibold">{companyName}</div>
            </div>
            <Button color="primary" variant="outlined" onClick={onSaveClick} className="rounded-none">
                Save
            </Button>
        </div>
    );
}
