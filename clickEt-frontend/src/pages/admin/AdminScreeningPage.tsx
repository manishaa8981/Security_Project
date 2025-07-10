
import { ScreeningForm } from "@/components/pageComponents/screening/ScreeningForm";
import ScreeningsTable from "@/components/pageComponents/screening/ScreeningTable";
import { useState } from "react";

const AdminHallPage = () => {
  const [showForm, setShowForm] = useState<boolean>(false);
  return (
    <div className="flex flex-col items-center w-full pl-10 pr-16">
      <div className=" flex flex-col justify-center w-full gap-5">
        <ScreeningsTable formState={showForm} setShowForm={setShowForm} />
        <div className="w-full">{showForm && <ScreeningForm />}</div>
      </div>
    </div>
  );
};

export default AdminHallPage;
