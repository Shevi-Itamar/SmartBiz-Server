import { Request, Response } from 'express';
import log4js from '../logger';
import BusinessService from '../services/business.service';
import { IBusiness } from '../models/Business.model';

const logger = log4js.getLogger('business.controller');

/**
 * GET /business
 * שליפת פרטי העסק
 */
const getBusiness = async (req: Request, res: Response): Promise<void> => {
  logger.info('GET /business - Fetching business details');

  try {
    const result = await BusinessService.getBusiness();
    logger.info('Business details fetched successfully');
    res.status(200).json(result);
  } catch (error: any) {
    logger.error(`Error fetching business: ${error.message}`);
    res.status(500).send(`Error fetching business: ${error.message}`);
  }
};

/**
 * PUT /business
 * עדכון פרטי העסק
 */
const updateBusiness = async (req: Request, res: Response): Promise<void> => {
  logger.info('PUT /business - Updating business details');

  try {
    const {
      _id,
      businessPassword,
      businessName,
      businessLocation,
      email,
      targetAudience,
      details,
      imagePath,
    } = req.body;

    if (!_id) {
      logger.warn('Update failed: Missing business ID');
      res.status(400).send('Missing business ID');
      return;
    }

    const updateData: Partial<IBusiness> = {
      _id,
      businessPassword,
      businessName,
      businessLocation,
      email,
      targetAudience,
      details,
      imagePath,
    };

    const result = await BusinessService.updateBusiness(updateData);
    logger.info(`Business with ID ${_id} updated successfully`);
    res.status(200).json(result);
  } catch (error: any) {
    logger.error(`Error updating business: ${error.message}`);
    res.status(500).send(`Error updating business: ${error.message}`);
  }
};

export default {
  getBusiness,
  updateBusiness,
};
