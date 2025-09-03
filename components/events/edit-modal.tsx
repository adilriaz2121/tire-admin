import React, { useState } from "react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
    Input,
    Checkbox,
} from "@nextui-org/react";
import { CalendarCog, X } from "lucide-react";
import TagInput from "./tag-input";
import { toast } from "sonner";
import { updateEvent } from "@/actions/event.action";
import uploadToCloudinary from "@/config/uploadToCloudinary";
import { useRouter } from "next/navigation";

export default function EditModel({ data }: any) {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const [name, setName] = useState(data.name);
    const [genre, setGenre] = useState(data.genre);
    const [venue, setVenue] = useState(data.venue);
    const [eventDate, setEventDate] = useState(data.event_date.split("T")[0]);
    const [startTime, setStartTime] = useState(data.event_start);
    const [endTime, setEndTime] = useState(data.event_end);
    const [eventType, setEventType] = useState(data.event_type);
    const [djs, setDjs] = useState(data.djs);
    const [area, setArea] = useState(data.area);
    const [websiteLink, setWebsiteLink] = useState(data.website_link);
    const [image, setImage] = useState(data.event_banner);
    const [ticketLink, setTicketLink] = useState(data.ticket_link);
    const [vinyl, setVinyl] = useState(data.vinyl);
    const [loading, setLoading] = useState(false)
    const [editing, setEditing] = useState(false)
    const handleOpen = () => {
        onOpen();
    };
    const router = useRouter()

    const handleUpdateEvent = async () => {
        if (!image || !name || !genre || !venue || !eventDate || !startTime || !endTime || !eventType || !djs) {
            toast.error("Please fill the required fields")
            return
        }
        setEditing(true)
        const updatedData = {
            ...data,
            name,
            genre,
            venue,
            event_date: eventDate,
            event_start: startTime,
            event_end: endTime,
            event_type: eventType,
            djs,
            event_banner: image,
            area,
            website_link: websiteLink,
            ticket_link: ticketLink,
            vinyl,
        };

        const { data: editData, error } = await updateEvent(data._id, updatedData)
        console.log("🚀 ~ handleUpdateEvent ~ editData:", editData)
        if (error) {
            toast.error("Error in editing event")
            setEditing(false)
            return
        }
        if (data) {
            toast.success("Event edit sucessfully")
            router.refresh()
            onClose()

        }

        setEditing(false)


    };

    const getStatus = () => {
        if (data.isRejected) return "Rejected Event";
        if (data.isApproved) return "Approved Event";
        return "Not Approved";
    };
    const uploadFile = async (e: any) => {
        const file = e.target.files[0];
        setLoading(true)
        const { URL, error: imageError } = await uploadToCloudinary(file)
        console.log("🚀 ~ submitEvent ~ URL:", URL)
        setImage(URL)
        if (imageError) {
            toast.error("Error uploading image")
            setLoading(false)
            return
        }
        setLoading(false)

    }

    return (
        <>
            <div className="flex flex-wrap gap-3">
                <button onClick={handleOpen}>
                    <CalendarCog size={20} className="text-blue-500" />
                </button>
            </div>
            <Modal
                size="full"
                isOpen={isOpen}
                onClose={onClose}
            // scrollBehavior="inside"
            >
                <ModalContent className="h-[100vh] overflow-y-auto">
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                {getStatus()}
                            </ModalHeader>
                            <ModalBody>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                                    <div className="flex justify-start items-start  max-w-full relative ">
                                        {
                                            image ?
                                                <>
                                                    <span
                                                        onClick={() => setImage(null)}
                                                        className="bg-red-600 text-white left-2 top-3 cursor-pointer hover:scale-95 absolute p-1 rounded-full flex items-center justify-center  ">

                                                        <X />
                                                    </span>

                                                    <img src={image} alt="banner" className="rounded-xl
                                            
                                            w-full
                                            " />


                                                </>
                                                :
                                                <>

                                                    <div className="flex items-center justify-center w-full cursor-pointer">
                                                        <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                                                            {
                                                                loading ?

                                                                    <div role="status">
                                                                        <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                                                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                                                        </svg>
                                                                        <span className="sr-only">Loading...</span>
                                                                    </div>


                                                                    :
                                                                    <>

                                                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                                            <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                                                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                                                            </svg>
                                                                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                                                            <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                                                                        </div>
                                                                    </>
                                                            }
                                                            <input id="dropzone-file" type="file" className="hidden"
                                                                onChange={(e) => uploadFile(e)

                                                                }
                                                            />
                                                        </label>
                                                    </div>

                                                </>
                                        }
                                    </div>

                                    <div className="flex flex-col gap-4 w-full md:row-span-2 md:col-span-2 ">
                                        <Input
                                            label="Name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Enter name"
                                            fullWidth
                                        />
                                        <Input
                                            label="Genre"
                                            value={genre}
                                            onChange={(e) => setGenre(e.target.value)}
                                            placeholder="Enter genre"
                                            fullWidth
                                        />
                                        <Input
                                            label="Venue"
                                            value={venue}
                                            onChange={(e) => setVenue(e.target.value)}
                                            placeholder="Enter venue"
                                            fullWidth
                                        />
                                        <Input
                                            label="Event Date"
                                            type="date"
                                            value={eventDate}
                                            onChange={(e) => setEventDate(e.target.value)}
                                            placeholder="Enter event date"
                                            fullWidth
                                        />
                                        <Input
                                            label="Start Time"
                                            type="time"
                                            value={startTime}
                                            onChange={(e) => setStartTime(e.target.value)}
                                            placeholder="Enter start time"
                                            fullWidth
                                        />
                                        <Input
                                            label="End Time"
                                            type="time"
                                            value={endTime}
                                            onChange={(e) => setEndTime(e.target.value)}
                                            placeholder="Enter end time"
                                            fullWidth
                                        />

                                        {/* Event Type Selector */}
                                        <div className="flex flex-col">
                                            <label className="font-medium text-black text-start">Event Type</label>
                                            <select
                                                name="eventType"
                                                value={eventType}
                                                onChange={(e) => setEventType(e.target.value)}
                                                className="flex cursor-pointer rounded-lg justify-start items-center mt-2.5 text-start px-5 whitespace-nowrap border border-solid bg-zinc-100 border-stone-200 min-h-[50px] text-slate-500 w-full"
                                            >
                                                <option value="">Select Event Type</option>
                                                <option value="One Time">One Time</option>
                                                <option value="Weekly Event">Weekly Event</option>
                                                <option value="Monthly Event">Monthly Event</option>
                                            </select>
                                        </div>

                                        {/* DJs Tag Input */}
                                        <TagInput
                                            values={djs}
                                            setValues={setDjs}
                                            name="djs"
                                            label="DJs"
                                            placeholder="Add DJ"
                                        />

                                        {/* Area Selector */}
                                        <div className="flex flex-col">
                                            <label className="font-medium text-black text-start">Area</label>
                                            <select
                                                name="area"
                                                value={area}
                                                onChange={(e) => setArea(e.target.value)}
                                                className="flex cursor-pointer rounded-lg justify-start items-center mt-2.5 text-start px-5 whitespace-nowrap border border-solid bg-zinc-100 border-stone-200 min-h-[50px] text-slate-500 w-full"
                                            >
                                                <option value="">Select Area</option>
                                                <option value="east_bay">East Bay</option>
                                                <option value="south_bay">South Bay</option>
                                                <option value="san_francisco">San Francisco</option>
                                            </select>
                                        </div>

                                        <Input
                                            label="Website Link"
                                            type="url"
                                            value={websiteLink}
                                            onChange={(e) => setWebsiteLink(e.target.value)}
                                            placeholder="Enter website link"
                                            fullWidth
                                        />
                                        <Input
                                            label="Ticket Link"
                                            type="url"
                                            value={ticketLink}
                                            onChange={(e) => setTicketLink(e.target.value)}
                                            placeholder="Enter ticket link"
                                            fullWidth
                                        />
                                        <Checkbox
                                            isSelected={vinyl}
                                            onChange={(checked) => setVinyl(checked)}
                                        >
                                            Vinyl Presence
                                        </Checkbox>
                                    </div>
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Close
                                </Button>
                                <Button
                                    color="primary"
                                    onPress={handleUpdateEvent}
                                >
                                    {
                                        editing ? " processing..." : "Save Changes"
                                    }

                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
