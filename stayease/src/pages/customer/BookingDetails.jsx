import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useBookings } from "../../context/BookingContext";
import Loading from "../../components/common/Loading";
import ErrorMessage from "../../components/common/ErrorMessage";
import EmptyState from "../../components/common/EmptyState";
import BookingStatus from "../../components/booking/BookingStatus";