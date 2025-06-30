import Business from '../models/Business.model'; 

const getBusiness = async () => {
    const result = await Business.findOne();
    return result;
}

const updateBusiness = async (businessData:any) => {
  const business = await Business.findOne();
  if (!business) throw new Error('No business found to update');
  Object.assign(business, businessData);
  const updatedBusiness = await business.save();
  return updatedBusiness;
};

export default {
    getBusiness,
    updateBusiness
}
