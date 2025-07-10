import { useState } from "react";

import DistributorsTable from "@/components/pageComponents/distributor/distributorTable";
import DistributorForm from "@/components/pageComponents/distributor/distributorForm/distributorForm";

const DashboardPage = () => {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editData, setEditData] = useState<any>(null);

  const onAdd = () => {
    setEditData(null);
    setShowForm(!showForm);
  };

  return (
    <div className="flex flex-col items-center w-full pl-10 pr-16">
      <div className=" flex flex-col justify-center w-full gap-5">
        <DistributorsTable
          formState={showForm}
          setShowForm={setShowForm}
          onAdd={onAdd}
          onEdit={(data) => {
            setEditData(data);
            setShowForm(true);
            
          }}
        />
        <div className="w-full">
          {showForm && <DistributorForm editData={editData} />}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
