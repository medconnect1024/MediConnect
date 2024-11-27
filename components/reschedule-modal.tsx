import { useState } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RescheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReschedule: (date: string, time: string) => void;
}

export function RescheduleModal({
  isOpen,
  onClose,
  onReschedule,
}: RescheduleModalProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [selectedTime, setSelectedTime] = useState<string>("");

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    // The calendar will close automatically as it's in "single" mode
  };

  const handleReschedule = () => {
    if (selectedDate && selectedTime) {
      const formattedDate = format(selectedDate, "yyyy-MM-dd");
      onReschedule(formattedDate, selectedTime);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Reschedule Appointment</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            className="rounded-md border"
          />
          <Select onValueChange={setSelectedTime}>
            <SelectTrigger>
              <SelectValue placeholder="Select time" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
                <SelectItem
                  key={hour}
                  value={`${hour.toString().padStart(2, "0")}:00`}
                >
                  {`${hour.toString().padStart(2, "0")}:00`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button onClick={onClose} variant="outline">
            Cancel
          </Button>
          <Button onClick={handleReschedule}>Reschedule</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
