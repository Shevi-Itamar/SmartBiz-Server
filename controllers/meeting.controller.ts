import { Request, Response } from 'express';
import log4js from '../logger';
import meetingService from '../services/meeting.service';
import Meeting, { IMeeting } from '../models/Meeting.model';


const logger = log4js.getLogger('meeting.controller');

interface UserRequest extends Request {
  user?: {
    email: string;
    role: 'admin' | 'user' | string;
  };
}

/**
 * GET /meetings
 */
const getAllMeetings = async (req: Request, res: Response): Promise<void> => {
  logger.info('GET /meetings - Fetching all meetings');
  try {
    const meetings = await meetingService.GetAllMeetings();
    res.status(200).json(meetings);
  } catch (err: any) {
    logger.error(`Error fetching meetings: ${err.message}`);
    res.status(500).json({ error: 'Failed to fetch meetings.' });
  }
};

/**
 * GET /meetings/user/:email
 */
const getMeetingsByEmail = async (req: Request, res: Response): Promise<void> => {
  const email = req.params.email;
  logger.info(`GET /meetings/user/${email} - Fetching meetings for user`);
  try {
    const allMeetings = await meetingService.GetAllMeetings();
    const filtered = allMeetings.filter((meeting:any) => meeting.clientID?.userEmail === email);
    res.status(200).json(filtered);
  } catch (err: any) {
    logger.error(`Error fetching meetings for ${email}: ${err.message}`);
    res.status(500).json({ error: 'Failed to fetch user meetings.' });
  }
};

/**
 * GET /meetings/:id
 */
const getMeetingById = async (req: UserRequest, res: Response): Promise<void> => {
  const meetingId = req.params.id;
  const currentUser = req.user;

  logger.info(`GET /meetings/${meetingId} - Fetching meeting by ID`);

  try {
    const meeting: any = await meetingService.GetMeetingById(meetingId);
    if (!meeting) {
      res.status(404).json({ error: 'Meeting not found.' });
      return;
    }

    if (
      !currentUser ||
      (meeting.clientID?.email !== currentUser.email && currentUser.role !== 'admin')
    ) {
      logger.warn(`Access denied to meeting ${meetingId} by ${currentUser?.email}`);
      res.status(403).json({ error: 'Access denied.' });
      return;
    }

    res.status(200).json(meeting);
  } catch (err: any) {
    logger.error(`Error fetching meeting by ID: ${err.message}`);
    res.status(500).json({ error: 'Failed to fetchעיח meeting.' });
  }
};

/**
 * POST /meetings
 */
const createMeeting = async (req: Request, res: Response): Promise<void> => {
  logger.info('POST /meetings - Creating new meeting');
  try {
    const saved = await meetingService.CreateMeeting(req.body);
    res.status(201).json(saved);
  } catch (err: any) {
    logger.error(`Error creating meeting: ${err.message}`);
    res.status(400).json({ error: err.message });
  }
};

/**
 * PUT /meetings/:id
 */
const updateMeeting = async (req: UserRequest, res: Response): Promise<void> => {
  const meetingId = req.params.id;
  const currentUser = req.user;

  logger.info(`PUT /meetings/${meetingId} - Updating meeting`);

  try {
    const meeting: any = await meetingService.GetMeetingById(meetingId);
    if (!meeting) {
      res.status(404).json({ error: 'Meeting not found.' });
      return;
    }

    if (
      !currentUser ||
      (meeting.clientID?.email !== currentUser.email && currentUser.role !== 'admin')
    ) {
      logger.warn(`Access denied for update by user ${currentUser?.email}`);
      res.status(403).json({ error: 'Access denied.' });
      return;
    }

    const updated = await meetingService.UpdateMeeting(meetingId, req.body);
    res.status(200).json(updated);
  } catch (err: any) {
    logger.error(`Error updating meeting: ${err.message}`);
    res.status(400).json({ error: err.message });
  }
};

/**
 * DELETE /meetings/:id
 */
const deleteMeeting = async (req: UserRequest, res: Response): Promise<void> => {
  const meetingId = req.params.id;
  const currentUser = req.user;

  logger.info(`DELETE /meetings/${meetingId} - Deleting meeting`);

  try {
    const meeting: any = await meetingService.GetMeetingById(meetingId);
    if (!meeting) {
      res.status(404).json({ error: 'Meeting not found.' });
      return;
    }

    if (
      !currentUser ||
      (meeting.clientID?.userEmail !== currentUser.email && currentUser.role !== 'admin')
    ) {
      logger.warn(`Access denied for deletion by user ${currentUser?.email}`);
      res.status(403).json({ error: 'Access denied.' });
      return;
    }

    await meetingService.DeleteMeeting(meetingId);
    res.status(200).json({ message: 'Meeting deleted.' });
  } catch (err: any) {
    logger.error(`Error deleting meeting: ${err.message}`);
    res.status(500).json({ error: 'Failed to delete meeting.' });
  }
};

/**
 * GET /meetings/available-hours?date=YYYY-MM-DD
 */
const getAvailableHours = async (req: Request, res: Response): Promise<void> => {
  logger.info('GET /meetings/available-hours - Fetching available hours');

  try {
    const { date } = req.params;

    if (!date || typeof date !== 'string') {
      res.status(400).json({ message: 'Missing or invalid date parameter' });
      return;
    }

    const parsedDate = new Date(date as string);
    if (isNaN(parsedDate.getTime())) {
      res.status(400).json({ message: 'Invalid date format' });
      return;
    }

    const freeHours = await meetingService.getFreeHoursByDate(parsedDate);
    res.status(200).json({ date, freeHours });
  } catch (error: any) {
    logger.error(`Error fetching available hours: ${error.message}`);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export default {
  getAllMeetings,
  getMeetingsByEmail,
  getMeetingById,
  createMeeting,
  updateMeeting,
  deleteMeeting,
  getAvailableHours
};
