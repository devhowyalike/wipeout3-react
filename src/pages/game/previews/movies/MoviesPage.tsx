import Menu from "@/components/Menu/Menu";
import Page from "@/components/Page";
import { Modal } from "@/components/Modal";
import VideoPlayer from "@/components/VideoPlayer";
import { MenuItem } from "@/types/Menu.types";
import { getMovieAnimation } from "@/components/WipeoutLink/animations";
import { movieData } from "./moviesData";
import { useOptions } from "@/hooks/useOptions";

/** Movie clips listing page. */
export default function MoviesPage() {
  const { modal: modalEnabled } = useOptions();

  const menuItems: MenuItem[] = movieData.map((movie) => {
    return {
      id: movie.id,
      label: movie.name,
      // Prevent page navigation
      path: "#",
      animation: getMovieAnimation(movie.id),
      modalConfig: {
        content: (
          <Modal width={movie.width} height={movie.height} label={`${movie.name} movie clip`}>
            <VideoPlayer
              src={movie.src}
              width={movie.width}
              height={movie.height}
              autoPlay
              nativeControls={!modalEnabled}
              ariaLabel={`${movie.name} movie clip`}
            />
          </Modal>
        ),
      },
    };
  });

  return (
    <Page
      theme="darkTheme"
      documentTitle="Game Select | Previews | Movie Clips"
      footerTitle="Movie Clips"
      footerSubtitle="Previews Select"
    >
      <Menu items={menuItems} />
    </Page>
  );
}
