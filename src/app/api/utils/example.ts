export const quoteInfo ={
      "product_id": "M000000000102",
      "policy_id": "P000000008812",
      "quote_id": "Q000000008780",
      "quote_no": "QMPC23004444",
      "proposal_id": "PR000000007578",
      "comp_plan": {
          "plan": "Comprehensive",
          "plan_premium_with_gst": 2220.36,
          "standard_excess": "SGD 750.00",  // this is the standard excess applicable for this plan
          "addl_named_drivers_premium": "SGD 60.00",
          "add_ons_included_in_this_plan" : [],
          "add_ons":
            {
              "addl_prem_for_loss_of_use":
                 {
                  "default_is_not_selected": 0,
                  //"transport_allowance_if_selected": 67.61, // if customer has opted this add-on option, pass “YES” in proposal request parameter “quick_proposal_lou” and pass “NO” in proposal request parameter “quick_proposal_cc”.
                  "courtesy_car_up_to_1600cc_if_selected": 121.7, // if customer has opted this add-on option, pass “NO” in proposal request parameter “quick_proposal_lou” and pass “Yes (up to 1,600cc)” in proposal request parameter “quick_proposal_cc”.
                  "courtesy_car_up_to_2000cc_if_selected": 162.27 // if customer has opted this add-on option, pass “NO” in proposal request parameter “quick_proposal_lou” and pass “Yes (up to 2,000cc)” in proposal request parameter “quick_proposal_cc”.
              },
          }
      },
  }
