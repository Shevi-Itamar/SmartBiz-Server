import Services from '../models/Service.model';

const getServices = async () => {
    const result = await Services.find();
    return result;
};

const getServiceById = async (id:any) => {
    const result = await Services.findById(id);
    return result;
};

const createService = async (serviceData:any) => {
    const { serviceName, serviceDescription, price, duration} = serviceData;

    const service = new Services({
        serviceName,
        serviceDescription,
        price,
        duration,
        
    });

    const result = await service.save();
    return result;
};

const updateService = async (serviceData:any) => {
    const { _id, serviceName, serviceDescription, price, duration, imagePath } = serviceData;

    if (!_id) throw new Error('Missing service ID');

    const updatedFields:any = {};
    if (serviceName !== undefined) updatedFields.serviceName = serviceName;
    if (serviceDescription !== undefined) updatedFields.serviceDescription = serviceDescription;
    if (price !== undefined) updatedFields.price = price;
    if (duration !== undefined) updatedFields.duration = duration;
    if (imagePath !== undefined) updatedFields.imagePath = imagePath;

    const service = await Services.findByIdAndUpdate(_id, updatedFields, { new: true, runValidators: true });

    if (!service) throw new Error('Service not found');
    return service;
};

const deleteService = async (id:any) => {
    const service = await Services.findByIdAndDelete(id);
    if (!service) throw new Error('Service not found');
    return service;
};

export default {
    getServices,
    getServiceById,
    createService,
    updateService,
    deleteService
};
