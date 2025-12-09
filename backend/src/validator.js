function validateFields(fields) {
  const required = [
    "policyNumber",
    "policyholderName",
    "incidentDate",
    "incidentTime",
    "incidentLocation",
    "incidentDescription",
    "claimType",
    "estimatedDamage",
    "initialEstimate",
    "claimant",
    "contactDetails",
    "assetType",
    "assetId"
  ];

  const missing = [];

  required.forEach(key => {
    if (!fields[key]) {
      missing.push(key);
    }
  });

  return missing;
}

module.exports = { validateFields };
