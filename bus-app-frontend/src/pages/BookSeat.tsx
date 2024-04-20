import BookSeatComp from "@/components/BookSeatComp";
import axios from "axios";
import { useEffect, useState } from "react";

import { BusDetails } from "@/types";
import { useParams } from "react-router-dom";
import { API_URL } from "@/utils/constants";

// Zustand stores
import useBusStore from "@/stores/busStore";

export default function BookSeat() {
  const { id } = useParams();
  const [busDetails, setBusDetails] = useState({} as BusDetails);
  const [render, setRender] = useState(false);
  const setBus = useBusStore((state) => state.setBus);

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(`${API_URL}/search/bus?id=${id}`, {
        withCredentials: true,
      });

      if (res.data.status === "error") {
        return alert(res.data.message);
      }
      setBusDetails(res.data.data[0] as BusDetails);
      setBus(res.data.data[0] as BusDetails);
      setRender(true);
    };
    fetchData();
  }, []);
  return (
    <>{render ? <BookSeatComp {...busDetails} /> : <div>Loading...</div>}</>
  );
}
