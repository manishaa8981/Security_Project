import CreateHallForm from "@/components/pageComponents/halls/CreateHallForm";
import HallsTable from "@/components/pageComponents/halls/HallsTable";
import { useState } from "react";

const AdminHallPage = () => {
  const [showForm, setShowForm] = useState<boolean>(false);
  return (
    <div className="flex flex-col items-center w-full pl-10 pr-16">
      <div className=" flex flex-col justify-center w-full gap-5">
        <HallsTable formState={showForm} setShowForm={setShowForm} />
        <div className="w-full">{showForm && <CreateHallForm />}</div>
      </div>
    </div>
  );
};

export default AdminHallPage;
