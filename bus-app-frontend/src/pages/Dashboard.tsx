import { API_URL } from "@/utils/constants";

// Types
import { BusCardProps } from "@/types";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";

import { useAuthStore } from "@/stores/authStore";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { useForm } from "react-hook-form";
import { z } from "zod";

import { Feather, CalendarIcon, SearchIcon } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import BusCard from "@/components/BusCard";

interface UserData {
  name: string;
  email: string;
}

export default function Dashboard() {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const { toast } = useToast();

  const name = useAuthStore((state) => state.name);
  const email = useAuthStore((state) => state.email);

  let data = { name: name, email: email } as UserData;

  const [buses, setBuses] = useState<BusCardProps[]>([]);

  const searchSchema = z.object({
    from: z.string(),
    to: z.string(),
    startTime: z.date(),
  });

  const form = useForm<z.infer<typeof searchSchema>>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      from: "",
      to: "",
      startTime: new Date(),
    },
  });

  useEffect(() => {
    console.log(data.name);
  }, []);

  async function handleLogout() {
    logout();
    alert("User logged out successfully");
    navigate("/");
  }

  async function onSubmit(data: z.infer<typeof searchSchema>) {
    const formattedDate = `${
      data.startTime.getMonth() + 1
    }-${data.startTime.getDate()}-${data.startTime.getFullYear()}`;
    let url = new URL(API_URL + "/search");

    const res = await fetch(url.toString(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        start: data.from,
        end: data.to,
        startTime: formattedDate,
      }),
      credentials: "include",
    });
    const resultantData = await res.json();

    if (resultantData.status === "success" && resultantData.data.length > 0) {
      setBuses(resultantData.data);
    } else {
      setBuses([]);
      return toast({
        title: "Bus Search",
        description: "No buses found",
      });
    }
  }

  return (
    <div>
      <nav className="w-full flex justify-between items-center p-4 md:px-20 gap-10 border border-b-2 border-b-slate-300">
        <div className="flex justify-center items-center gap-2 ">
          <Feather color="white" />
          <h1 className="text-2xl">
            <span className="text-green-500">Bus</span> Linker
          </h1>
        </div>
        <Button onClick={handleLogout}>Log out</Button>
      </nav>
      <div className="p-4 md:px-20 md:mt-8">
        <div className="w-full flex justify-between">
          <h1 className="text-xl md:text-3xl font-bold">Dashboard</h1>
          <div className="md:text-xl md:pr-20 lg:pr-40 flex justify-center items-center gap-2 md:gap-5">
            <div>
              Welcome, <span className="text-green-500">{data.name}</span>
            </div>
            <Link to="/p/tickets">
              <Button>My Tickets</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Search Bars */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-4 flex flex-col  gap-4 md:justify-between md:items-center px-4 md:flex-row lg:px-40"
        >
          <FormField
            control={form.control}
            name="from"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="From" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="to"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="To" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </FormItem>
            )}
          />
          <Button variant="outline" type="submit" className="text-xl gap-2">
            <SearchIcon size={24} color="green" /> Search
          </Button>
        </form>
      </Form>

      {/* Buses */}
      {buses.length === 0 ? (
        <div>
          <h1 className="text-2xl text-center mt-12">No buses found</h1>
        </div>
      ) : (
        <div className="p-4 py-8 md:px-20 lg:px-40">
          {buses.map((bus: BusCardProps) => {
            return <BusCard key={bus._id} {...bus} />;
          })}
        </div>
      )}
    </div>
  );
}
