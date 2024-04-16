import useCartStore from "@/stores/cartStore";
import useBusStore from "@/stores/busStore";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";

// Define an interface for a single registration unit
interface RegistrationUnit {
  name: string;
  age: number;
  gender: string;
  seatNumber: number;
}

export default function BookingFormComp() {
  const seats = useCartStore((state) => state.seats);
  const bus = useBusStore((state) => state.bus);
  const busId = bus._id;
  // Use the useForm hook to create a form instance
  const form = useForm<{ registrations: RegistrationUnit[] }>({
    defaultValues: {
      // registrations: [{ name: "", age: 0, gender: "", seatNumber: -1 }],
      registrations: seats.map((seat) => ({
        name: "",
        age: 0,
        gender: "",
        seatNumber: parseInt(seat),
      })),
    },
  });

  // Access the form state, methods, and the useFieldArray hook
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = form;
  const { fields } = useFieldArray({
    control,
    name: "registrations",
  });

  // Define a submit handler
  const onSubmit = (data: { registrations: RegistrationUnit[] }) => {
    const reqBody = { busId, seatDetails: [] as Record<string, unknown>[] };
    data.registrations.forEach((passenger) => {
      reqBody.seatDetails.push({
        seatNo: passenger.seatNumber,
        name: passenger.name,
        age: passenger.age,
        gender: passenger.gender,
      });
    });

    console.log(reqBody);
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {fields.map((field, index) => (
            <Card key={field.id} className="w-[350px] lg:w-[800px]">
              <CardHeader>
                <CardTitle>Passenger: {index + 1}</CardTitle>
                <CardDescription>
                  Seat number: {field.seatNumber}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={control}
                  name={`registrations.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>

                      <FormControl>
                        <Input placeholder="Enter name" {...field} />
                      </FormControl>
                      <FormMessage>
                        {errors.registrations?.[index]?.name?.message}
                      </FormMessage>
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name={`registrations.${index}.age`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter age"
                          type="number"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage>
                        {errors.registrations?.[index]?.age?.message}
                      </FormMessage>
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name={`registrations.${index}.gender`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your Gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="M">Male</SelectItem>
                          <SelectItem value="F">Female</SelectItem>
                        </SelectContent>
                      </Select>

                      <FormMessage>
                        {errors.registrations?.[index]?.gender?.message}
                      </FormMessage>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          ))}
          <div className="grid place-items-center">
            <Button
              type="submit"
              className="bg-green-500 hover:bg-green-900 text-white"
            >
              Reserve Seats
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
