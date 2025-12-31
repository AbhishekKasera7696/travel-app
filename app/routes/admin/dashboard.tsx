import {Header} from "../../../components";

const Dashboard = () => {
    const user = {name : "Abhishek"}
    return <main className="dashboard wrapper">
        <Header
           title={`Welcome ${user.name ?? 'Guest'}`}
           description="Track activity trends and popular destinations in real time"
        />
        Dashboards Page Contents
    </main>;
};

export default Dashboard;

