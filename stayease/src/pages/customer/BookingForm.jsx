import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useBookings } from "../../context/BookingContext";
import BookingFormComponent from "../../components/booking/BookingForm";
import { formatCurrency } from "../../utils/formatCurrency";