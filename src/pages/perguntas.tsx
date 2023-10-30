import type { Product } from '@prisma/client';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';

import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { Timer } from '@/components/Timer';
import { questions } from '@/constants/questions';

const Perguntas = ({ product }: { product: Product }) => {
  const { register, handleSubmit, getValues } = useForm();
  const router = useRouter();

  const createAnswer = async (data: any) => {
    return axios.post('/api/answers', {
      ...data,
      product: product.id,
    });
  };

  const { mutate, isLoading } = useMutation(
    'createAnswerMutation',
    createAnswer,
  );

  const onSubmit = async (data: any) => {
    const userId = localStorage.getItem('userId') || '';
    mutate(
      { ...data, userId },
      {
        onSuccess: () => {
          localStorage.setItem('product', data);
          router.push(`${product.id}/${userId}/gabarito/`);
        },
        onError: (err: any) => {
          toast.error(err.response.data.error || 'erro ao enviar respostas!');
        },
      },
    );
  };

  return (
    <>
      <Header />
      <main>
        <div className="m-auto flex w-full flex-col items-center justify-center gap-[32px] p-[32px] md:flex-row md:items-center md:justify-center md:gap-[64px]">
          <div className="flex flex-col items-center gap-[16px]">
            <div className="flex items-center">
              <div>
                <div className="relative h-[400px] w-full md:w-[400px]">
                  <div className="h-full w-full">
                    <iframe
                      className="h-full w-full"
                      title="Shinobi Frog"
                      allow="autoplay; fullscreen; xr-spatial-tracking"
                      src={product.sketchfab}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="py-[8px] text-center">
              <Timer getValues={getValues} productId={product.id} />
            </div>
            <h1 className="text-center text-[20px]">
              Assinale as alternativas conforme for identificado nas imagens:
            </h1>
            <form
              className="mt-[32px] flex flex-col gap-[16px] text-[16px]"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="flex flex-col gap-[16px] md:grid md:grid-cols-2">
                {questions.map((quest) => (
                  <div key={quest.key} className="flex items-center gap-[16px]">
                    <input
                      {...register(quest.key)}
                      type="checkbox"
                      className="h-[22px] w-[22px] rounded border-[transparent] bg-[#bcd0ff] text-blue-600"
                    />
                    <label htmlFor={quest.key}>{quest.value}</label>
                  </div>
                ))}
              </div>
              <div>
                <button
                  type="submit"
                  className="mt-[32px] flex w-full items-center justify-center gap-[16px] rounded bg-[#1f36c7] p-[8px] font-bold uppercase text-white"
                >
                  Enviar
                  {isLoading && (
                    <div className="animate-spin">
                      <AiOutlineLoading3Quarters />
                    </div>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export async function getServerSideProps() {
  try {
    const response = await axios.get(`${process.env.PROJECT_URL}api/products`);

    return {
      props: {
        product: response.data[Math.floor(Math.random() * 4)],
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
}

export default Perguntas;
