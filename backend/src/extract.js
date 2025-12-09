function extractFields(data) {
  return {
    // Policy Information
    policyNumber: data.policyNumber || null,
    policyholderName: data.policyholderName || null,
    effectiveDates: data.effectiveDates || null,   

    // Incident Information
    incidentDate: data.incidentDate || null,
    incidentTime: data.incidentTime || null,
    incidentLocation: data.incidentLocation || null,
    incidentDescription: data.incidentDescription || null,

    // Involved Parties
    claimant: data.claimant || null,               
    thirdParties: data.thirdParties || null,       
    contactDetails: data.contactDetails || null,   

    // Asset Details
    assetType: data.assetType || null,             
    assetId: data.assetId || null,                 
    estimatedDamage: data.estimatedDamage || null,
    //other
    claimType: data.claimType || null,
    attachments: data.attachments || null,
    initialEstimate: data.initialEstimate || null
  };
}

module.exports = { extractFields };
