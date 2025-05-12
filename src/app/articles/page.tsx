import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import CalendarBox from "@/components/CalenderBox";
import { Metadata } from "next";
import CategoryList from "./ArticleList";
import ArticlesListPage from "./ArticleList";

export const metadata: Metadata = {
  title: "Calender Page",
  // other metadata
};

const CalendarPage = () => {
  return (
    <>
      <Breadcrumb pageName="Articles" />

      <ArticlesListPage />
    </>
  );
};

export default CalendarPage;
