function decideWorkflow(fields, missing, classification) {
  // 1. Missing mandatory fields → Manual review
  if (missing.length > 0) {
    return {
      route: "Manual Review",
      reason: `Missing mandatory fields: ${missing.join(", ")}`
    };
  }

  // 2. Fraud keyword detection → Investigation
  const suspiciousWords = ["fraud", "inconsistent", "staged"];
  const desc = fields.incidentDescription?.toLowerCase() || "";

  if (suspiciousWords.some(word => desc.includes(word))) {
    return {
      route: "Investigation Queue",
      reason: "Suspicious keywords detected in description."
    };
  }

  // 3. Injury → Specialist
  if (fields.claimType?.toLowerCase() === "injury") {
    return {
      route: "Specialist Queue",
      reason: "Injury-related claim."
    };
  }

  // 4. Fast-track rule
  if (fields.estimatedDamage < 25000) {
    return {
      route: "Fast-track",
      reason: "Estimated damage < 25,000."
    };
  }

  // 5. Default manual review
  return {
    route: "Manual Review",
    reason: "Does not meet fast-track criteria."
  };
}

module.exports = { decideWorkflow };
