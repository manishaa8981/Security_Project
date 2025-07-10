import { useState } from "react";
import MoviesTable from "@/components/pageComponents/movie/movieTable";
import MovieForm from "../movie/AddmovieForm";
export default function MoviesPage() {
  const [showForm, setShowForm] = useState<boolean>(false);

  return (
    <div className=" mx-auto py-6">
      <MoviesTable formState={showForm} setShowForm={setShowForm} />
      <div className="w-full">{showForm && <MovieForm />}</div>
    </div>
  );
}
