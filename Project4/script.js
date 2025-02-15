$(document).ready(function () {
    $("#fetchData").click(function () {
        let confirmationNo = $("#confirmationNoInput").val().trim();

        if (confirmationNo === "") {
            $("#errorMsg").removeClass("hidden").text("⚠️ Please enter a confirmation number.");
            return;
        }

        $.ajax({
            url: "https://wlb2b.techmaster.in/dmc/SightseeingAPI/api/SightSeeing/GetSightSeeingBookingDetail",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({ "ConfirmationNo": confirmationNo }),
            success: function (response) {
                if (!response || !response.SightseeingBookingDetails) {
                    $("#errorMsg").removeClass("hidden").text("⚠️ No booking details found for this confirmation number.");
                    $("#dataContainer").addClass("hidden");
                    return;
                }

                $("#dataContainer").removeClass("hidden");
                $("#errorMsg").addClass("hidden");

                // Populate Data
                $("#confirmationNo").text(response.SightseeingBookingDetails.SightseeingBooking.ConfirmationNo || "N/A");
                $("#validity").text((response.SightseeingBookingDetails.SightSeeingValidityFrom || "N/A") + " to " + (response.SightseeingBookingDetails.SightSeeingValidityTo || "N/A"));
                $("#sightseeingID").text(response.SightseeingBookingDetails.SightseeingBooking.SightseeingID || "N/A");
                $("#currency").text(response.SightseeingBookingDetails.SightseeingBooking.Currency || "N/A");
                $("#startDate").text(response.SightseeingBookingDetails.SightseeingBooking.SightseeingStartDate || "N/A");
                $("#totalPrice").text(response.SightseeingBookingDetails.SightseeingBooking.TotalSightseeingPrice || "N/A");

                // Populate Guest List
                let guests = response.SightseeingBookingDetails.GuestList || [];
                $("#guestTable tr:not(:first)").remove();
                if (guests.length === 0) {
                    $("#guestTable").append("<tr><td colspan='4'>No guests found</td></tr>");
                } else {
                    guests.forEach(guest => {
                        $("#guestTable").append(`
                            <tr>
                                <td>${guest.GuestFullName || "N/A"}</td>
                                <td>${guest.Age || "N/A"}</td>
                                <td>${guest.Email || "N/A"}</td>
                                <td>${guest.PhoneNo || "N/A"}</td>
                            </tr>
                        `);
                    });
                }

                // Populate Cancellation Policy
                $("#cancellationRemarks").text(response.SightseeingBookingDetails.SightseeingBookingCancellationPolicy?.Remarks || "N/A");

                // Populate Voucher Link
                if (response.VoucherURLs && response.VoucherURLs.length > 0) {
                    $("#voucherLink").attr("href", response.VoucherURLs[0]);
                } else {
                    $("#voucherLink").attr("href", "#").text("No voucher available");
                }
            },
            error: function (xhr) {
                let errorMessage = "❌ An error occurred. Please try again later.";
                
                if (xhr.responseJSON) {
                    let apiError = xhr.responseJSON;
                    if (apiError.Message) {
                        errorMessage = `⚠️ ${apiError.Message}`;
                    }
                    if (apiError.ExceptionMessage) {
                        errorMessage += ` (${apiError.ExceptionMessage})`;
                    }
                }

                $("#dataContainer").addClass("hidden");
                $("#errorMsg").removeClass("hidden").text(errorMessage);
            }
        });
    });
});