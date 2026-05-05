import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";

type Props = {
    activeKey: "in_progress" | "completed";
    onChange: (key: "in_progress" | "completed") => void;
};

export default function LoggedOrdersTabs({ activeKey, onChange }: Props) {
    return (
        <Tabs
            id="ff-user-orders-tabs"
            activeKey={activeKey}
            onSelect={(k) => k && onChange(k as "in_progress" | "completed")}
            className="ff-tabs"
            fill
        >
            <Tab eventKey="in_progress" title="In progress" />
            <Tab eventKey="completed" title="Completed" />
        </Tabs>
    );
}