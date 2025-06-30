import { Request, Response } from 'express';
import log4js from '../logger';
import serviceService from '../services/services.service';
import { IService } from '../models/Service.model';

const logger = log4js.getLogger('service.controller');

// שליפת כל השירותים
const getAllServices = async (req: Request, res: Response): Promise<void> => {
  logger.info('GET /services - Fetching all services');
  try {
    const services = await serviceService.getServices();
    res.status(200).json(services);
  } catch (error: any) {
    logger.error(`Error fetching services: ${error.message}`);
    res.status(500).send(`Error fetching services: ${error.message}`);
  }
};

// שליפת שירות לפי ID
const getServiceById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  logger.info(`GET /services/${id} - Fetching service by ID`);

  if (!id) {
    logger.warn('Missing service ID');
    res.status(400).send('Missing service ID');
  }

  try {
    const service = await serviceService.getServiceById(id);
    if (!service) {
      logger.warn(`Service with ID ${id} not found`);
      res.status(404).send('Service not found');
    }

    res.status(200).json(service);
  } catch (error: any) {
    logger.error(`Error fetching service: ${error.message}`);
    res.status(500).send(`Error fetching service: ${error.message}`);
  }
};

// יצירת שירות חדש
const createService = async (req: Request, res: Response): Promise<void> => {
  logger.info('POST /services - Creating new service');

  const { serviceName, serviceDescription, price, duration } = req.body;
  if (!serviceName || !serviceDescription || price == null || duration == null) {
    logger.warn('Missing required fields in service creation');
    res.status(400).send('Missing required fields');
  }

  try {
    const newService = await serviceService.createService({
      serviceName,
      serviceDescription,
      price,
      duration,
  
    });

    logger.info(`Service created with ID: ${newService._id}`);
    res.status(201).json(newService);
  } catch (error: any) {
    logger.error(`Error creating service: ${error.message}`);
    res.status(500).send(`Error creating service: ${error.message}`);
  }
};

// עדכון שירות קיים
const updateService = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  logger.info(`PUT /services/${id} - Updating service`);

  if (!id) {
    logger.warn('Missing service ID in update');
    res.status(400).send('Missing service ID');
  }

  const { serviceName, serviceDescription, price, duration, imagePath } = req.body;

  const updatedData: Partial<IService> ={
    serviceName: serviceName || undefined,
    serviceDescription: serviceDescription || undefined,
    price: price || undefined,
    duration: duration || undefined,
    imagePath: imagePath || undefined,
  };

  try {
    const updatedService = await serviceService.updateService({ _id: id, ...updatedData });
    logger.info(`Service with ID ${id} updated`);
    res.status(200).json(updatedService);
  } catch (error: any) {
    logger.error(`Error updating service: ${error.message}`);
    res.status(500).send(`Error updating service: ${error.message}`);
  }
};

// מחיקת שירות
const deleteService = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  logger.info(`DELETE /services/${id} - Deleting service`);

  if (!id) {
    logger.warn('Missing service ID in delete');
     res.status(400).send('Missing service ID');
  }

  try {
    const deletedService = await serviceService.deleteService(id);
    if (!deletedService) {
      logger.warn(`Service with ID ${id} not found`);
      res.status(404).send('Service not found');
    }

    logger.info(`Service with ID ${id} deleted`);
    res.status(200).json(deletedService);
  } catch (error: any) {
    logger.error(`Error deleting service: ${error.message}`);
    res.status(500).send(`Error deleting service: ${error.message}`);
  }
};

export default{
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService
}