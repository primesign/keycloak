package org.keycloak.protocol.oidc.utils;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ValueNode;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.jboss.logging.Logger;
import org.keycloak.models.ClientModel;
import org.keycloak.models.Constants;
import org.keycloak.representations.ClaimsParameter;
import org.keycloak.representations.IDToken;
import org.keycloak.util.JsonSerialization;

public class AcrUtils {

  private static final Logger LOGGER = Logger.getLogger(AcrUtils.class);

  public static List<String> getRequiredAcrValues(String claimsParam) {
    if (claimsParam != null) {
      ClaimsParameter claims;
      try {
        claims = JsonSerialization.readValue(claimsParam, ClaimsParameter.class);
      } catch (IOException e) {
        throw new IllegalArgumentException("Invalid claims parameter: " + claimsParam);
      }
      Map<String, ClaimsParameter.ClaimRequest> idTokenClaims = claims.getIdToken();
      if (idTokenClaims != null) {
        ClaimsParameter.ClaimRequest acrClaim = idTokenClaims.get(IDToken.ACR);
        if (acrClaim != null && acrClaim.isEssential()) {
          List<ValueNode> values = acrClaim.getValues();
          if (values != null) {
            return values.stream().map(JsonNode::asText).collect(Collectors.toList());
          }
        }
      }
    }
    return Collections.emptyList();
  }

  public static List<String> getAcrValues(String claimsParam, String acrValuesParam) {
    List<String> acrValues = new ArrayList<>();
    if (acrValuesParam != null) {
      acrValues.addAll(Arrays.asList(acrValuesParam.split(" ")));
    }
    if (claimsParam != null) {
      ClaimsParameter claims;
      try {
        claims = JsonSerialization.readValue(claimsParam, ClaimsParameter.class);
      } catch (IOException e) {
        throw new IllegalArgumentException("Invalid claims parameter: " + claimsParam);
      }
      Map<String, ClaimsParameter.ClaimRequest> idTokenClaims = claims.getIdToken();
      if (idTokenClaims != null) {
        ClaimsParameter.ClaimRequest acrClaim = idTokenClaims.get(IDToken.ACR);
        if (acrClaim != null) {
          List<ValueNode> values = acrClaim.getValues();
          if (values != null) {
            acrValues.addAll(values.stream().map(JsonNode::asText).collect(Collectors.toList()));
          }
        }
      }
    }
    return acrValues;
  }

  public static Map<String, Integer> getAcrLoaMap(ClientModel client) {
    String map = client.getAttribute(Constants.ACR_LOA_MAP);
    if (map == null || map.isEmpty()) {
      return Collections.emptyMap();
    }
    try {
      return JsonSerialization.readValue(map, new TypeReference<Map<String, Integer>>() {});
    } catch (IOException e) {
      LOGGER.warn("Invalid client configuration (ACR-LOA map)");
      return Collections.emptyMap();
    }
  }

  public static String mapLoaToAcr(int loa, Map<String, Integer> acrLoaMap, Collection<String> acrValues) {
    String acr = null;
    if (!acrLoaMap.isEmpty() && !acrValues.isEmpty()) {
      int maxLoa = 0;
      for (String requestedAcr : acrValues) {
        Integer mappedLoa = acrLoaMap.get(requestedAcr);
        if (mappedLoa != null && mappedLoa > maxLoa && loa >= mappedLoa) {
          acr = requestedAcr;
          maxLoa = mappedLoa;
        }
      }
    }
    return acr;
  }
}
