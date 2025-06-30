import Meeting from '../models/Meeting.model';

const GetAllMeetings=async()=>{
    const result=await Meeting.find().populate('clientID').populate('serviceID');
    return result;
}

const GetMeetingById=async(id:any)=>{
    const result=await Meeting.findById(id).populate('clientID').populate('serviceID');
    return result;
}
const GetMeetingByClientId=async(clientID:any)=>{
    const result=await Meeting.find({   clientID:clientID}).populate('clientID').populate('serviceID');
    return result;
}
const CreateMeeting=async(meetingData:any)=>{
    const meeting = new Meeting(meetingData);
    if(meeting.meetDate < new Date()) {
        throw new Error('Meeting date cannot be in the past');
    }
    const result=await Meeting.findOne({meetDate:meeting.meetDate});
    if(result) {
        throw new Error('Meeting already exists on this date');
    }
    await meeting.save();
    return meeting;
}
const UpdateMeeting=async(id:any,meetingData:any)=>{
    const meeting = await Meeting.findByIdAndUpdate(id, meetingData, { new: true });
    if (!meeting) throw new Error('Meeting not found');
    return meeting;
}
const DeleteMeeting=async(id:any)=>{
    const meeting = await Meeting.findByIdAndDelete(id);
    if (!meeting) throw new Error('Meeting not found');
    return meeting;
}  
const getFreeHoursByDate = async (date: Date) => {
    const availableHours = ['09:00', '10:00', '11:00','12:00' ,'13:00', '14:00', '15:00', '20:00', '21:00', '22:00'];
    // הפורמט האחיד: YYYY-MM-DD
    const selectedDateString = date.toISOString().split('T')[0];
  
    const meetingsAtDate = (await GetAllMeetings()).filter(meeting => {
      const meetingDateString = meeting.meetDate.toISOString().split('T')[0];
      return meetingDateString === selectedDateString;
    });
  
    const takenHours = meetingsAtDate.map(meeting =>
      meeting.meetDate.toTimeString().slice(0, 5) // לדוגמה "20:00"
    );
  
    return availableHours.filter(hour => !takenHours.includes(hour));
};
export default {
    GetAllMeetings,
    GetMeetingByClientId,
    GetMeetingById,
    CreateMeeting,
    UpdateMeeting,
    DeleteMeeting,
    getFreeHoursByDate
}
